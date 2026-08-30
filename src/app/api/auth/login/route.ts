import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { generateSessionToken, hashSessionToken } from "@/lib/session-token";
import {
  checkRateLimit,
  registerFailedAttempt,
  resetRateLimit,
} from "@/lib/rate-limit";

const SESSION_DURATION_DAYS = Number(process.env.SESSION_DURATION_DAYS ?? "14");

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Champs invalides." }, { status: 400 });
  }

  const { username, password } = parsed.data;
  const identifier = `${ip}:${username.toLowerCase()}`;

  if (await checkRateLimit(identifier)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaie dans 15 minutes." },
      { status: 429 },
    );
  }

  const users = await sql`
    SELECT id, password_hash FROM users WHERE full_name = ${username} LIMIT 1
  `;
  const user = users[0];

  if (user) {
    const valid = await verifyPassword(user.password_hash as string, password);
    if (!valid) {
      await registerFailedAttempt(identifier);
      return NextResponse.json(
        { error: "Identifiants invalides." },
        { status: 401 },
      );
    }
    await resetRateLimit(identifier);
    const response = NextResponse.json({ redirect: "/commandes" });
    await attachSessionCookie(response, user.id as string);
    return response;
  }

  const bootstrapUsername = process.env.BOOTSTRAP_USERNAME;
  const bootstrapHash = process.env.BOOTSTRAP_PASSWORD_HASH;

  if (bootstrapUsername && bootstrapHash && username === bootstrapUsername) {

    const valid = await verifyPassword(bootstrapHash, password);
    if (valid) {
      await resetRateLimit(identifier);
      const response = NextResponse.json({ redirect: "/setup-account" });
      await attachSetupTokenCookie(response);
      return response;
    }
  }

  await registerFailedAttempt(identifier);
  return NextResponse.json(
    { error: "Identifiants invalides." },
    { status: 401 },
  );
}

async function attachSessionCookie(response: NextResponse, userId: string) {
  const token = generateSessionToken();
  const tokenHash = await hashSessionToken(token);
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
  );

  await sql`
    INSERT INTO sessions (user_id, token_hash, expires_at)
    VALUES (${userId}, ${tokenHash}, ${expiresAt.toISOString()})
  `;

  response.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

async function attachSetupTokenCookie(response: NextResponse) {
  const token = generateSessionToken();
  const tokenHash = await hashSessionToken(token);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await sql`
    INSERT INTO setup_tokens (token_hash, expires_at)
    VALUES (${tokenHash}, ${expiresAt.toISOString()})
  `;

  response.cookies.set("setup_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

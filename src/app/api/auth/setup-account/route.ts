import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { setupAccountSchema } from "@/lib/validation";
import { generateSessionToken, hashSessionToken } from "@/lib/session-token";

const SESSION_DURATION_DAYS = Number(process.env.SESSION_DURATION_DAYS);

export async function POST(request: NextRequest) {
  const setupToken = request.cookies.get("setup_token")?.value;
  if (!setupToken) {
    return NextResponse.json(
      { error: "Session expirée, reconnecte-toi." },
      { status: 401 },
    );
  }

  const tokenHash = await hashSessionToken(setupToken);
  const tokens = await sql`
    SELECT id, expires_at FROM setup_tokens WHERE token_hash = ${tokenHash} LIMIT 1
  `;
  const tokenRow = tokens[0];

  if (!tokenRow || new Date(tokenRow.expires_at as string) < new Date()) {
    return NextResponse.json(
      { error: "Session expirée, reconnecte-toi." },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = setupAccountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Champs invalides." },
      { status: 400 },
    );
  }

  const { fullName, password } = parsed.data;

  const existing =
    await sql`SELECT id FROM users WHERE full_name = ${fullName} LIMIT 1`;
  if (existing[0]) {
    return NextResponse.json(
      {
        error:
          "Ce nom est déjà pris. Ajoute une initiale par exemple (ex: Sarah B.).",
      },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const created = await sql`
    INSERT INTO users (full_name, password_hash)
    VALUES (${fullName}, ${passwordHash})
    RETURNING id
  `;
  const userId = created[0]?.id as string;

  await sql`DELETE FROM setup_tokens WHERE id = ${tokenRow.id}`;

  const sessionToken = generateSessionToken();
  const sessionTokenHash = await hashSessionToken(sessionToken);
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
  );

  await sql`
    INSERT INTO sessions (user_id, token_hash, expires_at)
    VALUES (${userId}, ${sessionTokenHash}, ${expiresAt.toISOString()})
  `;

  const response = NextResponse.json({ redirect: "/commandes" });
  response.cookies.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  response.cookies.delete("setup_token");

  return response;
}

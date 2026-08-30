import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export const config = {
  matcher: [
    "/((?!api/auth|login|setup-account|_next/static|_next/image|favicon.ico).*)",
  ],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  if (!token) return redirectToLogin(request);

  const tokenHash = await sha256Hex(token);
  const rows = await sql`
    SELECT sessions.expires_at
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ${tokenHash}
    LIMIT 1
  `;
  const session = rows[0];

  if (!session || new Date(session.expires_at as string) < new Date()) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashSessionToken } from "@/lib/session-token";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  if (token) {
    const tokenHash = await hashSessionToken(token);
    await sql`DELETE FROM sessions WHERE token_hash = ${tokenHash}`;
  }

  const response = NextResponse.json({ redirect: "/login" });
  response.cookies.delete("session");
  return response;
}

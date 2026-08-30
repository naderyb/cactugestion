import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { hashSessionToken } from "@/lib/session-token";

export interface CurrentUser {
  id: string;
  fullName: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  const tokenHash = await hashSessionToken(token);
  const rows = await sql`
    SELECT users.id, users.full_name, sessions.expires_at
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ${tokenHash}
    LIMIT 1
  `;
  const row = rows[0];
  if (!row || new Date(row.expires_at as string) < new Date()) return null;

  return { id: row.id as string, fullName: row.full_name as string };
}

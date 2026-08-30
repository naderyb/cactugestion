import { sql } from "@/lib/db";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;
const LOCK_MINUTES = 15;

export async function checkRateLimit(identifier: string): Promise<boolean> {
  const rows = await sql`
    SELECT locked_until FROM login_attempts WHERE identifier = ${identifier} LIMIT 1
  `;
  const lockedUntil = rows[0]?.locked_until as string | undefined;
  return Boolean(lockedUntil && new Date(lockedUntil) > new Date());
}

export async function registerFailedAttempt(identifier: string): Promise<void> {
  const rows = await sql`
    SELECT attempts, first_attempt_at FROM login_attempts WHERE identifier = ${identifier} LIMIT 1
  `;
  const row = rows[0];
  const now = new Date();

  if (!row) {
    await sql`
      INSERT INTO login_attempts (identifier, attempts, first_attempt_at)
      VALUES (${identifier}, 1, ${now.toISOString()})
    `;
    return;
  }

  const windowExpired =
    now.getTime() - new Date(row.first_attempt_at as string).getTime() >
    WINDOW_MINUTES * 60 * 1000;

  if (windowExpired) {
    await sql`
      UPDATE login_attempts
      SET attempts = 1, first_attempt_at = ${now.toISOString()}, locked_until = NULL
      WHERE identifier = ${identifier}
    `;
    return;
  }

  const newAttempts = (row.attempts as number) + 1;
  const lockedUntil =
    newAttempts >= MAX_ATTEMPTS
      ? new Date(now.getTime() + LOCK_MINUTES * 60 * 1000).toISOString()
      : null;

  await sql`
    UPDATE login_attempts SET attempts = ${newAttempts}, locked_until = ${lockedUntil}
    WHERE identifier = ${identifier}
  `;
}

export async function resetRateLimit(identifier: string): Promise<void> {
  await sql`DELETE FROM login_attempts WHERE identifier = ${identifier}`;
}

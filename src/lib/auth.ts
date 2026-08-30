import { hash, verify } from "@node-rs/argon2";
import { randomBytes, createHash } from "crypto";

const ARGON2_OPTIONS = {
  memoryCost: 19456, // 19 MiB - recommandation OWASP
  timeCost: 2,
  parallelism: 1,
};

export function normalizePasswordHash(passwordHash: string): string {
  return passwordHash.replace(/\\\$/g, "$").trim();
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(
  passwordHash: string,
  password: string,
): Promise<boolean> {
  try {
    const normalizedHash = normalizePasswordHash(passwordHash);
    return await verify(normalizedHash, password);
  } catch {
    return false;
  }
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

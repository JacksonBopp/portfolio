import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "gate_auth";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function verifyGatePassword(input: string): boolean {
  const expected = process.env.PRIVATE_GATE_PASSWORD;
  if (!expected || !input) {
    return false;
  }
  const a = Buffer.from(hashPassword(input));
  const b = Buffer.from(hashPassword(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function setGateCookie(): Promise<void> {
  const password = process.env.PRIVATE_GATE_PASSWORD;
  if (!password) return;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, hashPassword(password), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function hasValidGateCookie(): Promise<boolean> {
  const password = process.env.PRIVATE_GATE_PASSWORD;
  if (!password) return false;
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(hashPassword(password));
  return a.length === b.length && timingSafeEqual(a, b);
}

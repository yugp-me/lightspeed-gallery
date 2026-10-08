import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const cookieName = "lightspeed_session";
const sessionDuration = 60 * 60 * 24 * 7;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value && process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET is required in production");
  return value ?? "development-only-session-secret";
}
function sign(value: string) { return crypto.createHmac("sha256", secret()).update(value).digest("hex"); }

export async function verifyAdminPassword(password: string) {
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  return Boolean(hash && await bcrypt.compare(password, hash));
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === new URL(request.url).origin);
}

export function createSessionValue() {
  const payload = `${Date.now() + sessionDuration * 1000}.${crypto.randomBytes(18).toString("hex")}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSession(value?: string) {
  if (!value) return false;
  const [expires, nonce, signature] = value.split(".");
  const payload = `${expires}.${nonce}`;
  if (!expires || !nonce || !signature || Number(expires) < Date.now()) return false;
  const expected = sign(payload);
  return signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function isAdmin() { return isValidSession((await cookies()).get(cookieName)?.value); }
export { cookieName, sessionDuration };
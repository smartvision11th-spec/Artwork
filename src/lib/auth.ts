import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "artsell_admin";

function signature(value: string) {
  return crypto.createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "dev-secret").update(value).digest("hex");
}

export function makeAdminToken() {
  const value = `admin.${Date.now()}`;
  return `${value}.${signature(value)}`;
}

export function validAdminToken(token?: string) {
  if (!token) return false;
  const [value, sig] = token.split(".");
  if (!value || !sig) return false;
  const expected = signature(value);
  if (sig.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export async function isAdmin() {
  return validAdminToken((await cookies()).get(COOKIE)?.value);
}

export { COOKIE };

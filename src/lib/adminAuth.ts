import crypto from "crypto";

export const COOKIE_NAME = "admin_session";

export function getSessionToken(): string {
  const username = process.env.ADMIN_USERNAME ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.ADMIN_SECRET ?? "peters-outdoor-change-me";
  return crypto.createHmac("sha256", secret).update(`${username}:${password}`).digest("hex");
}

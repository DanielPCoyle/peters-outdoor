/**
 * Generates and verifies HMAC-signed tokens for booking check-in QR codes.
 * identifier = Stripe PaymentIntent ID (paid) or gift cert code (free booking)
 */

const SECRET = () => process.env.ADMIN_SECRET ?? "peters-outdoor-change-me";

async function hmac(identifier: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(identifier));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function generateCheckinToken(identifier: string): Promise<string> {
  return hmac(identifier);
}

export async function verifyCheckinToken(
  identifier: string,
  token: string
): Promise<boolean> {
  if (!identifier || !token) return false;
  const expected = await hmac(identifier);
  return expected === token;
}

/** Short random confirmation code shown to the guest at check-in (admin side) */
export function generateConfirmationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "CHKIN-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** Booking reference code shown in the confirmation email */
export function generateBookingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "BOOK-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

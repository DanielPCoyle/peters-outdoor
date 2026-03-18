/**
 * Atomically redeem a gift certificate after a successful Stripe payment.
 * Uses a conditional update so concurrent requests can't redeem the same cert twice.
 */
import { NextRequest, NextResponse } from "next/server";
import { getRequestByCode, atomicRedeem } from "@/lib/giftCertStore";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Missing code." }, { status: 400 });

  const cert = await getRequestByCode(code.trim().toUpperCase());
  if (!cert) return NextResponse.json({ error: "Gift certificate not found." }, { status: 404 });

  const redeemed = await atomicRedeem(cert.id);
  if (!redeemed) {
    return NextResponse.json({ error: "Already redeemed." }, { status: 409 });
  }

  return NextResponse.json({ success: true });
}

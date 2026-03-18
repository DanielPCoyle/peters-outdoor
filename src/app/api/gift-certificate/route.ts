import { NextResponse } from "next/server";

// This endpoint is superseded by /api/gift-certificate/create-payment-intent
export async function POST() {
  return NextResponse.json({ error: "Use /api/gift-certificate/create-payment-intent" }, { status: 410 });
}

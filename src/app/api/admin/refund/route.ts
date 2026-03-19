import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });
  }

  const { paymentIntentId, amount } = await req.json();
  if (!paymentIntentId) {
    return NextResponse.json({ error: "Missing paymentIntentId." }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Retrieve the payment intent to validate amount
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (pi.status !== "succeeded") {
    return NextResponse.json({ error: "Payment has not succeeded." }, { status: 400 });
  }

  const maxRefund = pi.amount; // in cents
  const refundAmountCents = amount != null
    ? Math.round(Number(amount) * 100)
    : maxRefund;

  if (refundAmountCents <= 0 || refundAmountCents > maxRefund) {
    return NextResponse.json(
      { error: `Refund amount must be between $0.01 and $${(maxRefund / 100).toFixed(2)}.` },
      { status: 400 }
    );
  }

  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: refundAmountCents,
  });

  return NextResponse.json({ refunded: refund.amount / 100, status: refund.status });
}

import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Fetch up to 100 most recent succeeded payment intents
  const intents = await stripe.paymentIntents.list({ limit: 100 });

  // Filter to tour bookings only (have tourId metadata)
  const orders = intents.data
    .filter((pi) => pi.metadata?.tourId && pi.status === "succeeded")
    .map((pi) => ({
      id: pi.id,
      tourId: pi.metadata.tourId,
      tourName: pi.metadata.tourName ?? pi.metadata.tourId,
      date: pi.metadata.date,
      guests: pi.metadata.guests,
      isPrivateCharter: pi.metadata.isPrivateCharter === "true",
      customerName: pi.metadata.customerName,
      email: pi.receipt_email ?? "",
      phone: pi.metadata.phone ?? "",
      notes: pi.metadata.notes ?? "",
      amount: pi.amount / 100,
      status: pi.status,
      createdAt: new Date(pi.created * 1000).toISOString(),
      stripeUrl: `https://dashboard.stripe.com/payments/${pi.id}`,
    }));

  return NextResponse.json(orders);
}

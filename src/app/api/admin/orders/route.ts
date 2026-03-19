import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const [intents, privateTours] = await Promise.all([
    stripe.paymentIntents.list({ limit: 100 }),
    prisma.privateTour.findMany({ where: { status: "paid" }, orderBy: { updatedAt: "desc" } }),
  ]);

  // Regular tour bookings (have tourId metadata)
  const regularOrders = intents.data
    .filter((pi) => pi.metadata?.tourId && pi.status === "succeeded")
    .map((pi) => ({
      id: pi.id,
      tourId: pi.metadata.tourId,
      tourName: pi.metadata.tourName ?? pi.metadata.tourId,
      date: pi.metadata.date,
      guests: pi.metadata.guests,
      isPrivateCharter: pi.metadata.isPrivateCharter === "true",
      isPrivateTour: false,
      customerName: pi.metadata.customerName,
      email: pi.receipt_email ?? "",
      phone: pi.metadata.phone ?? "",
      notes: pi.metadata.notes ?? "",
      amount: pi.amount / 100,
      status: pi.status,
      createdAt: new Date(pi.created * 1000).toISOString(),
      stripeUrl: `https://dashboard.stripe.com/payments/${pi.id}`,
    }));

  // Paid private / corporate tours from DB
  const privateTourOrders = privateTours.map((t) => ({
    id: t.stripePaymentIntentId ?? t.id,
    tourId: t.id,
    tourName: t.title,
    date: t.date,
    guests: String(t.guests),
    isPrivateCharter: false,
    isPrivateTour: true,
    customerName: t.clientName,
    email: t.clientEmail,
    phone: "",
    notes: t.notes ?? "",
    amount: Number(t.price),
    status: "succeeded",
    createdAt: t.updatedAt.toISOString(),
    stripeUrl: t.stripePaymentIntentId
      ? `https://dashboard.stripe.com/payments/${t.stripePaymentIntentId}`
      : "",
  }));

  // Merge and sort newest first
  const orders = [...regularOrders, ...privateTourOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json(orders);
}

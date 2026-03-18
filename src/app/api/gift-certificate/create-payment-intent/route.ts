import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createRequest } from "@/lib/giftCertStore";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });
  }

  const { yourName, yourEmail, recipientName, message, amount } = await req.json();

  if (!yourName || !yourEmail || !amount || amount < 25) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    receipt_email: yourEmail,
    metadata: {
      type: "gift_certificate",
      yourName,
      yourEmail,
      recipientName: recipientName || "",
    },
    description: `Gift Certificate — $${amount} from ${yourName}`,
  });

  const record = await createRequest({
    yourName,
    yourEmail,
    recipientName,
    message,
    amount,
    stripePaymentIntentId: paymentIntent.id,
  });

  if (!record) {
    // Supabase not configured — still return clientSecret so payment works
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      requestId: null,
    });
  }

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    requestId: record.id,
  });
}

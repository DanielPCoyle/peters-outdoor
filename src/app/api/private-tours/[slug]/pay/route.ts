import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { SEND_FROM_EMAIL, CONTACT_EMAIL } from "@/lib/email";
import { emailWrapper, detailCard, detailRow, para, signature } from "@/lib/emailTemplate";

function fmt12h(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });
  }

  const tour = await prisma.privateTour.findUnique({ where: { slug } });
  if (!tour) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (tour.status !== "pending") return NextResponse.json({ error: "This booking has already been paid or cancelled." }, { status: 409 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const price = Number(tour.price);

  const formattedDate = new Date(tour.date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(price * 100),
    currency: "usd",
    receipt_email: tour.clientEmail,
    metadata: {
      type: "private_tour",
      privateTourId: tour.id,
      slug: tour.slug,
      title: tour.title,
      date: tour.date,
      time: tour.time ?? "",
      guests: String(tour.guests),
      clientName: tour.clientName,
      clientEmail: tour.clientEmail,
    },
    description: `${tour.title} — Private Tour on ${tour.date}`,
  });

  // Mark in-progress
  await prisma.privateTour.update({
    where: { id: tour.id },
    data: { stripePaymentIntentId: paymentIntent.id },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}

// Called after successful payment to mark as paid + send emails
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { paymentIntentId } = await req.json();

  const tour = await prisma.privateTour.findUnique({ where: { slug } });
  if (!tour) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.privateTour.update({
    where: { id: tour.id },
    data: { status: "paid", stripePaymentIntentId: paymentIntentId },
  });

  // Send confirmation emails
  if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("your_api_key")) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const formattedDate = new Date(tour.date + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    const rows = [
      detailRow("Tour", tour.title),
      detailRow("Date", formattedDate),
      tour.time ? detailRow("Time", fmt12h(tour.time)) : "",
      detailRow("Guests", String(tour.guests)),
      tour.location ? detailRow("Location", tour.location) : "",
      detailRow("Total Paid", `<span style="color:#C9A84C;font-size:18px;">$${Number(tour.price).toFixed(2)}</span>`, true),
    ].join("");

    const clientBody = `
      ${para(`Hi <strong style="color:#2D5016;">${tour.clientName}</strong> — your private tour is confirmed! We're excited to take you out on the water.`)}
      ${detailCard(rows)}
      ${para("We'll be in touch with meeting point details and any weather updates. Questions? Just reply to this email.")}
      ${signature}
    `;

    const adminBody = `
      ${para(`A private tour booking has been paid.`)}
      ${detailCard([
        detailRow("Client", tour.clientName),
        detailRow("Email", `<a href="mailto:${tour.clientEmail}">${tour.clientEmail}</a>`, true),
        ...rows.split("</tr>").filter(Boolean).map(r => r + "</tr>"),
      ].join(""))}
      ${signature}
    `;

    await Promise.allSettled([
      resend.emails.send({
        from: SEND_FROM_EMAIL,
        to: tour.clientEmail,
        replyTo: CONTACT_EMAIL,
        subject: `Your Private Tour is Confirmed — ${tour.title}`,
        html: emailWrapper("Tour Confirmed!", clientBody),
      }),
      resend.emails.send({
        from: SEND_FROM_EMAIL,
        to: CONTACT_EMAIL,
        subject: `Private Tour Paid — ${tour.clientName} · ${tour.title}`,
        html: emailWrapper("Private Tour Booked", adminBody),
      }),
    ]);
  }

  return NextResponse.json({ success: true });
}

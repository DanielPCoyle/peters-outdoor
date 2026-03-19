import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyCheckinToken, generateConfirmationCode } from "@/lib/checkinToken";
import { getRequestByCode } from "@/lib/giftCertStore";

function stripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

/** GET /api/admin/checkin?pi=...&token=... OR ?cert=...&token=... OR ?code=BOOK-XXXX */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const pi = searchParams.get("pi");
  const cert = searchParams.get("cert");
  const token = searchParams.get("token");
  const code = searchParams.get("code"); // manual booking code lookup

  // ── Manual lookup by booking code ──
  if (code) {
    if (!process.env.STRIPE_SECRET_KEY)
      return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });

    const results = await stripe().paymentIntents.search({
      query: `metadata["bookingCode"]:"${code.trim().toUpperCase()}"`,
      limit: 1,
    });

    const intent = results.data[0];
    if (!intent) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

    const m = intent.metadata ?? {};
    return NextResponse.json({
      type: "paid",
      id: intent.id,
      customerName: m.customerName ?? "",
      email: intent.receipt_email ?? "",
      phone: m.phone ?? "",
      tourName: m.tourName ?? m.tourId ?? "",
      date: m.date ?? "",
      guests: m.guests ?? "",
      isPrivateCharter: m.isPrivateCharter === "true",
      notes: m.notes ?? "",
      addOns: m.addOns ?? "",
      amount: intent.amount / 100,
      checkedIn: m.checkedIn === "true",
      checkedInAt: m.checkedInAt ?? null,
      confirmationCode: m.confirmationCode ?? null,
      bookingCode: m.bookingCode ?? code,
      // token-free: pi ID is returned so the POST can use it
      piId: intent.id,
    });
  }

  if (!token) return NextResponse.json({ error: "Missing token." }, { status: 400 });

  // ── Paid booking via Stripe PI ──
  if (pi) {
    const valid = await verifyCheckinToken(pi, token);
    if (!valid) return NextResponse.json({ error: "Invalid token." }, { status: 403 });

    if (!process.env.STRIPE_SECRET_KEY)
      return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });

    const intent = await stripe().paymentIntents.retrieve(pi);
    const m = intent.metadata ?? {};

    return NextResponse.json({
      type: "paid",
      id: pi,
      customerName: m.customerName ?? "",
      email: intent.receipt_email ?? "",
      phone: m.phone ?? "",
      tourName: m.tourName ?? m.tourId ?? "",
      date: m.date ?? "",
      guests: m.guests ?? "",
      isPrivateCharter: m.isPrivateCharter === "true",
      notes: m.notes ?? "",
      addOns: m.addOns ?? "",
      amount: intent.amount / 100,
      checkedIn: m.checkedIn === "true",
      checkedInAt: m.checkedInAt ?? null,
      confirmationCode: m.confirmationCode ?? null,
    });
  }

  // ── Free booking via gift cert ──
  if (cert) {
    const valid = await verifyCheckinToken(cert, token);
    if (!valid) return NextResponse.json({ error: "Invalid token." }, { status: 403 });

    const record = await getRequestByCode(cert.trim().toUpperCase());
    if (!record) return NextResponse.json({ error: "Gift certificate not found." }, { status: 404 });

    return NextResponse.json({
      type: "gift",
      id: cert,
      customerName: record.yourName,
      email: record.yourEmail,
      tourName: "",
      date: "",
      guests: "",
      certCode: cert,
      amount: 0,
      checkedIn: !!record.redeemedAt,
      checkedInAt: record.redeemedAt ?? null,
      confirmationCode: null,
    });
  }

  return NextResponse.json({ error: "Missing pi or cert parameter." }, { status: 400 });
}

/** POST /api/admin/checkin — perform the check-in */
export async function POST(req: NextRequest) {
  const { pi, cert, token, piId } = await req.json();

  // piId is used for manual (no-token) check-ins; the middleware already
  // verified the admin session cookie, so no HMAC token is needed here.
  if (!token && !piId) return NextResponse.json({ error: "Missing token." }, { status: 400 });

  const confirmationCode = generateConfirmationCode();
  const now = new Date().toISOString();

  // ── Manual check-in by piId (no HMAC token needed — admin session verified by middleware) ──
  if (piId && !token) {
    if (!process.env.STRIPE_SECRET_KEY)
      return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });

    const intent = await stripe().paymentIntents.retrieve(piId);
    if (intent.metadata?.checkedIn === "true") {
      return NextResponse.json({ confirmationCode: intent.metadata.confirmationCode, alreadyCheckedIn: true });
    }
    const confirmationCode = generateConfirmationCode();
    await stripe().paymentIntents.update(piId, {
      metadata: { ...intent.metadata, checkedIn: "true", checkedInAt: new Date().toISOString(), confirmationCode },
    });
    return NextResponse.json({ confirmationCode });
  }

  // ── Paid booking ──
  if (pi) {
    const valid = await verifyCheckinToken(pi, token);
    if (!valid) return NextResponse.json({ error: "Invalid token." }, { status: 403 });

    if (!process.env.STRIPE_SECRET_KEY)
      return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });

    const intent = await stripe().paymentIntents.retrieve(pi);
    if (intent.metadata?.checkedIn === "true") {
      return NextResponse.json({
        confirmationCode: intent.metadata.confirmationCode,
        alreadyCheckedIn: true,
      });
    }

    await stripe().paymentIntents.update(pi, {
      metadata: {
        ...intent.metadata,
        checkedIn: "true",
        checkedInAt: now,
        confirmationCode,
      },
    });

    return NextResponse.json({ confirmationCode });
  }

  // ── Free / gift cert booking ──
  if (cert) {
    const valid = await verifyCheckinToken(cert, token);
    if (!valid) return NextResponse.json({ error: "Invalid token." }, { status: 403 });

    // For gift cert check-in we just return a confirmation code
    // (the cert is already marked redeemed at booking time)
    return NextResponse.json({ confirmationCode });
  }

  return NextResponse.json({ error: "Missing pi or cert parameter." }, { status: 400 });
}

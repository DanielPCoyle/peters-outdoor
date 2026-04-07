import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getRequestByCode } from "@/lib/giftCertStore";
import { getTourById } from "@/lib/tourStore";
import { getAddOnById } from "@/lib/addOnStore";
import { prisma } from "@/lib/prisma";

const PRIVATE_CHARTER_PRICE = 399;

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("your_secret_key")) {
    return NextResponse.json({ error: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local." }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const body = await req.json();
  const { tourId, date, time, guests, isPrivateCharter, name, email, phone, notes, giftCertCode, discountCode: discountCodeInput, selectedAddOnIds, pfdSizes, emergencyName, emergencyPhone } = body;

  if (!tourId || !date || !guests || !name || !email) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const dbTour = await getTourById(tourId);
  if (!dbTour || !dbTour.isActive) {
    return NextResponse.json({ error: "Invalid tour." }, { status: 400 });
  }

  // Resolve selected add-ons
  const addOnIds: string[] = Array.isArray(selectedAddOnIds) ? selectedAddOnIds : [];
  const resolvedAddOns = await Promise.all(addOnIds.map((id) => getAddOnById(id)));
  const validAddOns = resolvedAddOns.filter((a): a is NonNullable<typeof a> => a !== null && a.isActive);
  const addOnsTotal = validAddOns.reduce((s, a) => s + a.price, 0);

  const tourSubtotal = isPrivateCharter ? PRIVATE_CHARTER_PRICE : dbTour.price * guests;
  const baseTotal = tourSubtotal + addOnsTotal;

  // Validate gift cert if provided
  let giftCertDiscount = 0;
  let giftCertId: string | undefined;
  if (giftCertCode) {
    const cert = await getRequestByCode(giftCertCode.trim().toUpperCase());
    if (!cert || cert.status !== "active") {
      return NextResponse.json({ error: "Invalid or already redeemed gift certificate." }, { status: 400 });
    }
    giftCertDiscount = Math.min(cert.amount, baseTotal);
    giftCertId = cert.id;
  }

  // Validate discount code if provided
  let promoDiscount = 0;
  let promoCodeId: string | undefined;
  if (discountCodeInput) {
    const promo = await prisma.discountCode.findUnique({ where: { code: discountCodeInput.trim().toUpperCase() } });
    if (!promo || !promo.isActive) {
      return NextResponse.json({ error: "Invalid or inactive discount code." }, { status: 400 });
    }
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Discount code has expired." }, { status: 400 });
    }
    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return NextResponse.json({ error: "Discount code usage limit reached." }, { status: 400 });
    }
    if (promo.discountType === "percentage") {
      promoDiscount = Math.round(baseTotal * (promo.discountValue / 100) * 100) / 100;
    } else {
      promoDiscount = Math.min(promo.discountValue, baseTotal);
    }
    promoCodeId = promo.id;
    // Increment usage
    await prisma.discountCode.update({ where: { id: promo.id }, data: { usedCount: { increment: 1 } } });
  }

  const total = baseTotal - promoDiscount - giftCertDiscount;

  // Fully covered by gift cert + discount — no Stripe needed
  if (total <= 0) {
    return NextResponse.json({ fullyPaid: true, giftCertId, giftCertDiscount, promoDiscount, promoCodeId });
  }

  const description = isPrivateCharter
    ? `${dbTour.name} — Private Charter on ${date}`
    : `${dbTour.name} — ${guests} guest${guests > 1 ? "s" : ""} on ${date}`;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: "usd",
    receipt_email: email,
    metadata: {
      tourId,
      tourName: dbTour.name,
      date,
      time: time ?? "",
      guests: String(guests),
      isPrivateCharter: isPrivateCharter ? "true" : "false",
      customerName: name,
      phone: phone ?? "",
      notes: notes ?? "",
      giftCertCode: giftCertCode ?? "",
      giftCertId: giftCertId ?? "",
      giftCertDiscount: String(giftCertDiscount),
      discountCode: discountCodeInput ?? "",
      discountCodeId: promoCodeId ?? "",
      promoDiscount: String(promoDiscount),
      addOns: validAddOns.map((a) => a.name).join(", "),
      addOnsTotal: String(addOnsTotal),
      pfdSizes: Array.isArray(pfdSizes) ? pfdSizes.join(", ") : "",
      emergencyContact: emergencyName ? `${emergencyName} — ${emergencyPhone ?? ""}` : "",
    },
    description,
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    giftCertDiscount,
    giftCertId,
    promoDiscount,
    promoCodeId,
  });
}

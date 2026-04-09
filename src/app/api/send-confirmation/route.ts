import { NextRequest, NextResponse } from "next/server";
import { sendEmail, CONTACT_EMAIL } from "@/lib/email";
import {
  emailWrapper, detailCard, detailRow, sectionHeading,
  para, signature, ctaButton, qrCodeBlock, siteUrl,
} from "@/lib/emailTemplate";
import { generateCheckinToken, generateBookingCode } from "@/lib/checkinToken";
import Stripe from "stripe";

const TOUR_NAMES: Record<string, string> = {
  newport: "Newport Bay Salt Marsh Tour",
  pocomoke: "Pocomoke River Cypress Swamp Tour",
  stmartin: "St. Martin River Tour",
  assateague: "Assateague Island Tour",
  sunset: "Sunset Kayak Tour",
  fullmoon: "Full Moon Kayak Tour",
};

export async function POST(req: NextRequest) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return NextResponse.json({ error: "Email is not configured." }, { status: 503 });
  }

  const { tourId, date, time, guests, name, email, phone, notes, total, addOns, stripePaymentIntentId, location, locationUrl, pfdSizes, emergencyName, emergencyPhone } = await req.json();

  const tourName = TOUR_NAMES[tourId] ?? tourId;
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  function fmt12h(t: string): string {
    const [h, m] = t.split(":").map(Number);
    const p = h >= 12 ? "PM" : "AM";
    return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${p}`;
  }

  const locationHtml = location
    ? (locationUrl
        ? `<a href="${locationUrl}" style="color:#2D5016;text-decoration:underline;">${location}</a>`
        : location)
    : "";

  const pfdSummary = Array.isArray(pfdSizes) && pfdSizes.length > 0
    ? pfdSizes.map((s: string, i: number) => `Guest ${i + 1}: ${s}`).join(", ")
    : "";

  const rows = [
    detailRow("Tour", tourName),
    detailRow("Date", formattedDate),
    time ? detailRow("Time", fmt12h(time)) : "",
    locationHtml ? detailRow("Location", locationHtml) : "",
    detailRow("Guests", String(guests)),
    pfdSummary ? detailRow("Life Jacket Sizes", pfdSummary) : "",
    phone ? detailRow("Phone", phone) : "",
    emergencyName ? detailRow("Emergency Contact", `${emergencyName}${emergencyPhone ? ` — ${emergencyPhone}` : ""}`) : "",
    addOns ? detailRow("Add-ons", addOns) : "",
    notes ? detailRow("Notes", notes) : "",
    detailRow("Total Paid", `<span style="color:#C9A84C;font-size:18px;">$${Number(total).toFixed(2)}</span>`, true),
  ].join("");

  // Generate booking code + QR for check-in
  let qrBlock = "";
  if (stripePaymentIntentId && process.env.STRIPE_SECRET_KEY) {
    const bookingCode = generateBookingCode();
    const token = await generateCheckinToken(stripePaymentIntentId);
    const checkinUrl = `${siteUrl()}/admin/checkin?pi=${stripePaymentIntentId}&token=${token}`;
    qrBlock = qrCodeBlock(checkinUrl, bookingCode);

    // Store the booking code in Stripe metadata so the admin check-in page can surface it
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    stripe.paymentIntents.update(stripePaymentIntentId, {
      metadata: { bookingCode },
    }).catch(console.error);
  }

  const body = `
    ${para(`Hi <strong style="color:#2D5016;">${name}</strong>, thanks for booking with us! We can't wait to take you out on the water. Here's a summary of your reservation.`)}
    ${detailCard(rows)}
    ${sectionHeading("What to Bring")}
    <ul style="margin:0 0 24px;padding-left:20px;color:#4a5568;font-size:14px;line-height:2.2;font-family:Arial,sans-serif;">
      <li>Water and snacks</li>
      <li>Sunscreen and a hat</li>
      <li>Camera or phone in a waterproof case</li>
      <li>Light layers (weather can change)</li>
      <li>Closed-toe shoes that can get wet</li>
    </ul>
    ${ctaButton("Browse More Tours", `${siteUrl()}/tours`)}
    ${location
      ? para(`We'll be in touch closer to your tour date with any weather updates. Questions? Just reply to this email or call us at <a href="tel:410-357-1025" style="color:#2D5016;">410-357-1025</a>.`)
      : para(`We'll be in touch closer to your tour date with meeting location details and any weather updates. Questions? Just reply to this email or call us at <a href="tel:410-357-1025" style="color:#2D5016;">410-357-1025</a>.`)}
    ${qrBlock}
    ${signature}
  `;

  try {
    await sendEmail({
      to: email,
      replyTo: CONTACT_EMAIL,
      subject: `Booking Confirmed — ${tourName}`,
      html: emailWrapper("You're Booked!", body),
    });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Failed to send confirmation email." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

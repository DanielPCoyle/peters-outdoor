import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  emailWrapper, detailCard, detailRow, sectionHeading,
  para, signature, ctaButton, qrCodeBlock, siteUrl,
} from "@/lib/emailTemplate";
import { generateCheckinToken } from "@/lib/checkinToken";

const TOUR_NAMES: Record<string, string> = {
  newport: "Newport Bay Salt Marsh Tour",
  pocomoke: "Pocomoke River Cypress Swamp Tour",
  stmartin: "St. Martin River Tour",
  assateague: "Assateague Island Tour",
  sunset: "Sunset Kayak Tour",
  fullmoon: "Full Moon Kayak Tour",
};

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("your_api_key")) {
    return NextResponse.json({ error: "Resend is not configured." }, { status: 503 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { tourId, date, guests, name, email, phone, notes, total, addOns, stripePaymentIntentId } = await req.json();

  const tourName = TOUR_NAMES[tourId] ?? tourId;
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const rows = [
    detailRow("Tour", tourName),
    detailRow("Date", formattedDate),
    detailRow("Guests", String(guests)),
    phone ? detailRow("Phone", phone) : "",
    addOns ? detailRow("Add-ons", addOns) : "",
    notes ? detailRow("Notes", notes) : "",
    detailRow("Total Paid", `<span style="color:#C9A84C;font-size:18px;">$${Number(total).toFixed(2)}</span>`, true),
  ].join("");

  // Generate QR code for admin check-in
  let qrBlock = "";
  if (stripePaymentIntentId) {
    const token = await generateCheckinToken(stripePaymentIntentId);
    const checkinUrl = `${siteUrl()}/admin/checkin?pi=${stripePaymentIntentId}&token=${token}`;
    qrBlock = qrCodeBlock(checkinUrl, stripePaymentIntentId);
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
    ${para("We'll be in touch closer to your tour date with meeting location details and any weather updates. Questions? Just reply to this email or call us at <a href=\"tel:410-357-1025\" style=\"color:#2D5016;\">410-357-1025</a>.")}
    ${qrBlock}
    ${signature}
  `;

  const { error } = await resend.emails.send({
    from: "W.H. Peters Outdoor Adventures <noreply@simplerdevelopment.com>",
    to: email,
    replyTo: "info@petersoutdoor.com",
    subject: `Booking Confirmed — ${tourName}`,
    html: emailWrapper("You're Booked!", body),
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send confirmation email." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

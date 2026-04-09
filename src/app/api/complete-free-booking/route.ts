/**
 * Complete a booking fully covered by a gift certificate.
 * Atomically marks the cert as redeemed — safe against double-submission.
 */
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SEND_FROM_EMAIL, CONTACT_EMAIL } from "@/lib/email";
import { getRequestByCode, atomicRedeem } from "@/lib/giftCertStore";
import {
  emailWrapper, detailCard, detailRow, sectionHeading,
  para, signature, ctaButton, qrCodeBlock, siteUrl,
} from "@/lib/emailTemplate";
import { generateCheckinToken } from "@/lib/checkinToken";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { giftCertCode, tourName, date, time, guests, name, email } = body;

  if (!giftCertCode || !tourName || !date || !name || !email) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const cert = await getRequestByCode(giftCertCode.trim().toUpperCase());
  if (!cert) {
    return NextResponse.json({ error: "Gift certificate not found." }, { status: 404 });
  }

  const redeemed = await atomicRedeem(cert.id);
  if (!redeemed) {
    return NextResponse.json({ error: "This gift certificate has already been redeemed." }, { status: 409 });
  }

  if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("your_api_key")) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    function fmt12h(t: string): string {
      const [h, m] = t.split(":").map(Number);
      const p = h >= 12 ? "PM" : "AM";
      return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${p}`;
    }

    const rows = [
      detailRow("Tour", tourName),
      detailRow("Date", formattedDate),
      time ? detailRow("Time", fmt12h(time)) : "",
      detailRow("Guests", String(guests)),
      detailRow(
        "Payment",
        `<span style="color:#C9A84C;">Gift Certificate ${redeemed.certificateCode}</span>`,
        true
      ),
    ].join("");

    // QR code for admin check-in using cert code
    const certCode = redeemed.certificateCode!;
    const checkinToken = await generateCheckinToken(certCode);
    const checkinUrl = `${siteUrl()}/admin/checkin?cert=${certCode}&token=${checkinToken}`;

    const emailBody = `
      ${para(`Hi <strong style="color:#2D5016;">${name}</strong>, your booking is confirmed! Your gift certificate covered the full amount — no payment needed. Here's your reservation summary.`)}
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
      ${para("We'll be in touch closer to your tour date with meeting location details and any weather updates. Questions? Reply to this email or call <a href=\"tel:410-357-1025\" style=\"color:#2D5016;\">410-357-1025</a>.")}
      ${qrCodeBlock(checkinUrl, certCode.replace("PETERS-", "BOOK-"))}
      ${signature}
    `;

    await resend.emails.send({
      from: SEND_FROM_EMAIL,
      to: email,
      replyTo: CONTACT_EMAIL,
      subject: `Booking Confirmed — ${tourName}`,
      html: emailWrapper("You're Booked!", emailBody),
    }).catch(console.error);
  }

  return NextResponse.json({ success: true });
}

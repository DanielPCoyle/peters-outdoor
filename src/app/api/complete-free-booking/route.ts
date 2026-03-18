/**
 * Complete a booking fully covered by a gift certificate.
 * Atomically marks the cert as redeemed — safe against double-submission.
 */
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getRequestByCode, atomicRedeem } from "@/lib/giftCertStore";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { giftCertCode, tourName, date, guests, name, email } = body;

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
    await resend.emails.send({
      from: "W.H. Peters Outdoor Adventures <bookings@petersoutdoor.com>",
      to: email,
      replyTo: "info@petersoutdoor.com",
      subject: `Booking Confirmed — ${tourName}`,
      html: `
        <p>Hi ${name},</p>
        <p>Your booking is confirmed! We used your gift certificate (${redeemed.certificateCode}) for the full amount.</p>
        <p><strong>Tour:</strong> ${tourName}<br/>
        <strong>Date:</strong> ${date}<br/>
        <strong>Guests:</strong> ${guests}<br/>
        <strong>Paid with:</strong> Gift Certificate ${redeemed.certificateCode}</p>
        <p>Questions? Reply to this email or contact us at info@petersoutdoor.com</p>
        <p>See you on the water!<br/>W.H. Peters Outdoor Adventures</p>
      `,
    }).catch(console.error);
  }

  return NextResponse.json({ success: true });
}

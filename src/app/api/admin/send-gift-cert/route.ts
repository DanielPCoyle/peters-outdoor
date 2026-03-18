/**
 * Resend a gift certificate that was already paid for.
 * Called from the admin when the buyer reports not receiving the email.
 */
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getRequestById } from "@/lib/giftCertStore";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  const record = await getRequestById(id);
  if (!record) return NextResponse.json({ error: "Record not found." }, { status: 404 });
  if (record.status !== "active" || !record.certificateCode) {
    return NextResponse.json({ error: "Certificate is not in active state." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("your_api_key")) {
    console.log(`Resend not configured — certificate ${record.certificateCode} NOT re-sent`);
    return NextResponse.json({ success: true, note: "Resend not configured" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "W.H. Peters Outdoor Adventures <bookings@petersoutdoor.com>",
    to: record.yourEmail,
    replyTo: "info@petersoutdoor.com",
    subject: `Your Gift Certificate (Resent) — ${record.certificateCode}`,
    html: `<p>Hi ${record.yourName},</p><p>Here is your gift certificate code as requested: <strong>${record.certificateCode}</strong></p><p>Amount: $${record.amount}</p><p>Please contact us at info@petersoutdoor.com to book your tour.</p>`,
  });

  return NextResponse.json({ success: true });
}

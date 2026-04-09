/**
 * Resend a gift certificate that was already paid for.
 * Called from the admin when the buyer reports not receiving the email.
 */
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SEND_FROM_EMAIL, CONTACT_EMAIL } from "@/lib/email";
import { getRequestById } from "@/lib/giftCertStore";
import { emailWrapper, certBadge, para, sectionHeading, signature, siteUrl } from "@/lib/emailTemplate";

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

  const messageBlock = record.message
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;border-left:4px solid #C9A84C;border-radius:0 8px 8px 0;margin-bottom:28px;"><tr><td style="padding:16px 20px;"><p style="margin:0 0 4px;color:#C9A84C;font-size:11px;font-family:Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">A message for you</p><p style="margin:0;color:#4a5568;font-size:15px;font-style:italic;line-height:1.6;">"${record.message}"</p></td></tr></table>`
    : "";

  const emailBody = `
    ${para(`Hi <strong style="color:#2D5016;">${record.yourName}</strong>, as requested, here is your gift certificate. Forward it to your recipient so they can book their adventure!`)}
    ${certBadge(record.certificateCode, record.amount)}
    ${messageBlock}
    ${sectionHeading("How to Redeem")}
    <ol style="margin:0 0 24px;padding-left:20px;color:#4a5568;font-size:14px;line-height:2.2;font-family:Arial,sans-serif;">
      <li>Browse tours at <a href="${siteUrl()}/tours" style="color:#2D5016;">${siteUrl()}/tours</a></li>
      <li>Call <a href="tel:410-357-1025" style="color:#2D5016;">410-357-1025</a> or email <a href="mailto:${CONTACT_EMAIL}" style="color:#2D5016;">${CONTACT_EMAIL}</a></li>
      <li>Mention certificate code <strong>${record.certificateCode}</strong> when booking</li>
    </ol>
    ${signature}
  `;

  await resend.emails.send({
    from: SEND_FROM_EMAIL,
    to: record.yourEmail,
    replyTo: CONTACT_EMAIL,
    subject: `Your Gift Certificate (Resent) — ${record.certificateCode}`,
    html: emailWrapper("Gift Certificate", emailBody),
  });

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmail, CONTACT_EMAIL } from "@/lib/email";
import { getRequestById, updateRequest, generateCertCode } from "@/lib/giftCertStore";
import { emailWrapper, certBadge, para, sectionHeading, signature, siteUrl } from "@/lib/emailTemplate";

export async function POST(req: NextRequest) {
  const { requestId } = await req.json();

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Look up the record
  const record = requestId ? await getRequestById(requestId) : null;

  if (!record) {
    // Supabase not configured or record missing — still return a code so the UX works
    const certCode = generateCertCode();
    return NextResponse.json({ certificateCode: certCode });
  }

  // Verify payment with Stripe
  const pi = await stripe.paymentIntents.retrieve(record.stripePaymentIntentId!);
  if (pi.status !== "succeeded") {
    return NextResponse.json({ error: "Payment not completed." }, { status: 402 });
  }

  // Already completed (idempotent)
  if (record.status === "active" && record.certificateCode) {
    return NextResponse.json({ certificateCode: record.certificateCode });
  }

  const certCode = generateCertCode();
  const now = new Date().toISOString();

  await updateRequest(record.id, {
    status: "active",
    certificateCode: certCode,
    sentAt: now,
  });

  // Send the certificate email
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {

    const messageBlock = record.message
      ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;border-left:4px solid #C9A84C;border-radius:0 8px 8px 0;margin-bottom:28px;"><tr><td style="padding:16px 20px;"><p style="margin:0 0 4px;color:#C9A84C;font-size:11px;font-family:Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">A message from ${record.yourName}</p><p style="margin:0;color:#4a5568;font-size:15px;font-style:italic;line-height:1.6;">"${record.message}"</p></td></tr></table>`
      : "";

    const recipientLine = record.recipientName
      ? ` — here is the gift certificate for <strong style="color:#2D5016;">${record.recipientName}</strong>. Forward this to your recipient so they can book their adventure!`
      : " — here is your gift certificate. You can use this code to book any of our guided kayak eco-tours.";

    const emailBody = `
      ${para(`Hi <strong style="color:#2D5016;">${record.yourName}</strong>${recipientLine}`)}
      ${certBadge(certCode, record.amount)}
      ${messageBlock}
      ${sectionHeading("How to Redeem")}
      <ol style="margin:0 0 24px;padding-left:20px;color:#4a5568;font-size:14px;line-height:2.2;font-family:Arial,sans-serif;">
        <li>Browse tours at <a href="${siteUrl()}/tours" style="color:#2D5016;">${siteUrl()}/tours</a></li>
        <li>Call <a href="tel:410-357-1025" style="color:#2D5016;">410-357-1025</a> or email <a href="mailto:${CONTACT_EMAIL}" style="color:#2D5016;">${CONTACT_EMAIL}</a></li>
        <li>Mention certificate code <strong>${certCode}</strong> when booking</li>
      </ol>
      ${signature}
    `;

    await sendEmail({
      to: record.yourEmail,
      replyTo: CONTACT_EMAIL,
      subject: `Your Gift Certificate — ${certCode}`,
      html: emailWrapper("Gift Certificate", emailBody),
    }).catch(console.error);
  }

  return NextResponse.json({ certificateCode: certCode });
}

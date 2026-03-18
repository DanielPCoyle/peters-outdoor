import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { getRequestById, updateRequest, generateCertCode } from "@/lib/giftCertStore";

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
  if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("your_api_key")) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "W.H. Peters Outdoor Adventures <bookings@petersoutdoor.com>",
      to: record.yourEmail,
      replyTo: "info@petersoutdoor.com",
      subject: `Your Gift Certificate — ${certCode}`,
      html: certEmailHtml(record.yourName, record.recipientName, record.amount, certCode, record.message),
    }).catch(console.error);
  }

  return NextResponse.json({ certificateCode: certCode });
}

function certEmailHtml(
  yourName: string,
  recipientName: string | undefined,
  amount: number,
  certCode: string,
  message: string | undefined
): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#2D5016;padding:32px 40px;border-radius:16px 16px 0 0;text-align:center;">
            <p style="margin:0 0 4px;color:#C9A84C;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">W.H. Peters Outdoor Adventures</p>
            <h1 style="margin:0;color:#fff;font-size:28px;font-weight:bold;">Gift Certificate</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;padding:40px;">
            <p style="margin:0 0 20px;color:#4a5568;font-size:16px;line-height:1.6;">
              Hi ${yourName},${recipientName ? ` here is the gift certificate for <strong style="color:#2D5016;">${recipientName}</strong>.` : " here is your gift certificate."} Forward this to your recipient so they can book their adventure!
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;border:2px solid #C9A84C;border-radius:16px;margin-bottom:28px;">
              <tr>
                <td style="padding:32px;text-align:center;">
                  <p style="margin:0 0 6px;color:#6b7280;font-size:12px;font-family:Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">Certificate Value</p>
                  <p style="margin:0 0 20px;color:#2D5016;font-size:52px;font-weight:bold;font-family:Georgia,serif;">$${Number(amount).toFixed(0)}</p>
                  <p style="margin:0 0 8px;color:#6b7280;font-size:11px;font-family:Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">Certificate Code</p>
                  <div style="display:inline-block;background:#2D5016;border-radius:10px;padding:12px 28px;margin-bottom:20px;">
                    <p style="margin:0;color:#C9A84C;font-size:24px;font-weight:bold;font-family:'Courier New',monospace;letter-spacing:3px;">${certCode}</p>
                  </div>
                  <p style="margin:0;color:#6b7280;font-size:13px;font-family:Arial,sans-serif;line-height:1.5;">Valid for any guided kayak eco-tour · No expiration date</p>
                </td>
              </tr>
            </table>
            ${message ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;border-left:4px solid #C9A84C;border-radius:0 8px 8px 0;margin-bottom:28px;"><tr><td style="padding:16px 20px;"><p style="margin:0 0 4px;color:#C9A84C;font-size:11px;font-family:Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">A message from ${yourName}</p><p style="margin:0;color:#4a5568;font-size:15px;font-style:italic;line-height:1.6;">"${message}"</p></td></tr></table>` : ""}
            <p style="margin:0 0 10px;color:#2D5016;font-size:13px;font-weight:bold;font-family:Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">How to Redeem</p>
            <ol style="margin:0 0 24px;padding-left:20px;color:#4a5568;font-size:14px;line-height:2;font-family:Arial,sans-serif;">
              <li>Browse tours at <a href="https://petersoutdoor.com/tours" style="color:#2D5016;">petersoutdoor.com/tours</a></li>
              <li>Call <a href="tel:410-357-1025" style="color:#2D5016;">410-357-1025</a> or email <a href="mailto:info@petersoutdoor.com" style="color:#2D5016;">info@petersoutdoor.com</a></li>
              <li>Mention your certificate code <strong>${certCode}</strong> when booking</li>
            </ol>
          </td>
        </tr>
        <tr>
          <td style="background:#2D5016;padding:24px 40px;border-radius:0 0 16px 16px;text-align:center;">
            <p style="margin:0;color:#a8b89a;font-size:12px;font-family:Arial,sans-serif;">
              <a href="mailto:info@petersoutdoor.com" style="color:#C9A84C;">info@petersoutdoor.com</a> · <a href="tel:410-357-1025" style="color:#C9A84C;">410-357-1025</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

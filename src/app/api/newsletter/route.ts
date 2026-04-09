import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SEND_FROM_EMAIL, CONTACT_EMAIL } from "@/lib/email";
import { emailWrapper, detailCard, detailRow, sectionHeading, para } from "@/lib/emailTemplate";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  // Persist to DB (upsert so duplicates are silently ignored)
  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
  } catch { /* non-fatal */ }

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("your_api_key")) {
    console.log("Newsletter signup (Resend not configured):", email);
    return NextResponse.json({ success: true });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const body = `
    ${para("A new visitor has subscribed to the W.H. Peters Outdoor Adventures newsletter.")}
    ${detailCard(detailRow("Email Address", email, true))}
    ${sectionHeading("Next Steps")}
    ${para("Add this subscriber to your mailing list and send them upcoming tour announcements, seasonal promotions, and nature guides.")}
  `;

  await resend.emails.send({
    from: SEND_FROM_EMAIL,
    to: CONTACT_EMAIL,
    subject: `New Newsletter Subscriber — ${email}`,
    html: emailWrapper("New Subscriber", body),
  });

  return NextResponse.json({ success: true });
}

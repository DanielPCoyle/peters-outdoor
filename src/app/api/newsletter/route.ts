import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { emailWrapper, detailCard, detailRow, sectionHeading, para } from "@/lib/emailTemplate";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

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
    from: "W.H. Peters Outdoor Adventures <noreply@simplerdevelopment.com>",
    to: "info@petersoutdoor.com",
    subject: `New Newsletter Subscriber — ${email}`,
    html: emailWrapper("New Subscriber", body),
  });

  return NextResponse.json({ success: true });
}

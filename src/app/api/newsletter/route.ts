import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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

  // Notify the business
  await resend.emails.send({
    from: "W.H. Peters Outdoor Adventures <bookings@petersoutdoor.com>",
    to: "info@petersoutdoor.com",
    subject: `New Newsletter Signup — ${email}`,
    html: `<p>New newsletter subscriber: <strong>${email}</strong></p>`,
  });

  return NextResponse.json({ success: true });
}

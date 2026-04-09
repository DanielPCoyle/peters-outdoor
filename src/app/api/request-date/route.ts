import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SEND_FROM_EMAIL, CONTACT_EMAIL } from "@/lib/email";
import { emailWrapper, detailCard, detailRow, para, sectionHeading, signature } from "@/lib/emailTemplate";

export async function POST(req: NextRequest) {
  const { tourName, name, email, phone, preferredDate, message } = await req.json();

  if (!name || !email || !preferredDate) {
    return NextResponse.json({ error: "name, email, and preferredDate are required." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("your_api_key")) {
    // Dev: just log and return success
    console.log("Date request (Resend not configured):", { tourName, name, email, phone, preferredDate, message });
    return NextResponse.json({ success: true });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const formattedDate = new Date(preferredDate + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const rows = [
    tourName ? detailRow("Tour Requested", tourName) : "",
    detailRow("Name", name),
    detailRow("Email", `<a href="mailto:${email}" style="color:#2D5016;">${email}</a>`, true),
    phone ? detailRow("Phone", phone) : "",
    detailRow("Preferred Date", formattedDate),
    message ? detailRow("Message", message) : "",
  ].join("");

  const body = `
    ${para(`A customer has requested a custom date for a tour. Review their details below and reach out to confirm.`)}
    ${detailCard(rows)}
    ${sectionHeading("Next Steps")}
    ${para(`Reply directly to this email or contact ${name} at <a href="mailto:${email}" style="color:#2D5016;">${email}</a>${phone ? ` or <a href="tel:${phone}" style="color:#2D5016;">${phone}</a>` : ""} to discuss availability.`)}
    ${signature}
  `;

  const { error } = await resend.emails.send({
    from: SEND_FROM_EMAIL,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `Custom Date Request — ${tourName ?? "Tour"}`,
    html: emailWrapper("Custom Date Request", body),
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send request." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

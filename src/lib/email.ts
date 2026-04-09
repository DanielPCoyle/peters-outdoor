import nodemailer from "nodemailer";

export const SEND_FROM_EMAIL =
  process.env.SEND_FROM_EMAIL ?? "W.H. Peters Outdoor Adventures <noreply@simplerdevelopment.com>";

export const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL ?? "info@petersoutdoor.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  return transporter.sendMail({
    from: SEND_FROM_EMAIL,
    to,
    subject,
    html,
    replyTo,
  });
}

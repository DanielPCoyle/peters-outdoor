import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TOUR_NAMES: Record<string, string> = {
  newport: "Newport Bay Salt Marsh Tour",
  pocomoke: "Pocomoke River Cypress Swamp Tour",
  stmartin: "St. Martin River Tour",
  assateague: "Assateague Island Tour",
  sunset: "Sunset Kayak Tour",
  fullmoon: "Full Moon Kayak Tour",
};

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("your_api_key")) {
    return NextResponse.json({ error: "Resend is not configured." }, { status: 503 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { tourId, date, guests, name, email, phone, notes, total } = await req.json();

  const tourName = TOUR_NAMES[tourId] ?? tourId;
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const { error } = await resend.emails.send({
    from: "W.H. Peters Outdoor Adventures <bookings@petersoutdoor.com>",
    to: email,
    replyTo: "info@petersoutdoor.com",
    subject: `Booking Confirmed — ${tourName}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#2D5016;padding:32px 40px;border-radius:16px 16px 0 0;text-align:center;">
            <p style="margin:0 0 4px 0;color:#C9A84C;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif;">W.H. Peters Outdoor Adventures</p>
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">You're Booked!</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px;">

            <p style="margin:0 0 24px 0;color:#4a5568;font-size:16px;line-height:1.6;">
              Hi ${name}, thanks for booking with us! We're looking forward to taking you out on the water. Here's a summary of your reservation.
            </p>

            <!-- Booking details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;border-radius:12px;padding:24px;margin-bottom:24px;">
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #e2ddd6;">
                  <table width="100%"><tr>
                    <td style="color:#6b7280;font-size:14px;font-family:Arial,sans-serif;">Tour</td>
                    <td style="color:#2D5016;font-size:14px;font-weight:bold;font-family:Arial,sans-serif;text-align:right;">${tourName}</td>
                  </tr></table>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #e2ddd6;">
                  <table width="100%"><tr>
                    <td style="color:#6b7280;font-size:14px;font-family:Arial,sans-serif;">Date</td>
                    <td style="color:#2D5016;font-size:14px;font-weight:bold;font-family:Arial,sans-serif;text-align:right;">${formattedDate}</td>
                  </tr></table>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #e2ddd6;">
                  <table width="100%"><tr>
                    <td style="color:#6b7280;font-size:14px;font-family:Arial,sans-serif;">Guests</td>
                    <td style="color:#2D5016;font-size:14px;font-weight:bold;font-family:Arial,sans-serif;text-align:right;">${guests}</td>
                  </tr></table>
                </td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #e2ddd6;">
                  <table width="100%"><tr>
                    <td style="color:#6b7280;font-size:14px;font-family:Arial,sans-serif;">Phone</td>
                    <td style="color:#2D5016;font-size:14px;font-family:Arial,sans-serif;text-align:right;">${phone}</td>
                  </tr></table>
                </td>
              </tr>` : ""}
              ${notes ? `
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #e2ddd6;">
                  <table width="100%"><tr>
                    <td style="color:#6b7280;font-size:14px;font-family:Arial,sans-serif;">Notes</td>
                    <td style="color:#2D5016;font-size:14px;font-family:Arial,sans-serif;text-align:right;">${notes}</td>
                  </tr></table>
                </td>
              </tr>` : ""}
              <tr>
                <td style="padding:12px 0 0 0;">
                  <table width="100%"><tr>
                    <td style="color:#2D5016;font-size:16px;font-weight:bold;font-family:Arial,sans-serif;">Total Paid</td>
                    <td style="color:#C9A84C;font-size:20px;font-weight:bold;font-family:Arial,sans-serif;text-align:right;">$${Number(total).toFixed(2)}</td>
                  </tr></table>
                </td>
              </tr>
            </table>

            <!-- What to expect -->
            <p style="margin:0 0 8px 0;color:#2D5016;font-size:14px;font-weight:bold;font-family:Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">What to Bring</p>
            <ul style="margin:0 0 24px 0;padding-left:20px;color:#4a5568;font-size:14px;line-height:2;font-family:Arial,sans-serif;">
              <li>Water and snacks</li>
              <li>Sunscreen and a hat</li>
              <li>Camera or phone in a waterproof case</li>
              <li>Light layers (weather can change)</li>
              <li>Closed-toe shoes that can get wet</li>
            </ul>

            <p style="margin:0 0 24px 0;color:#4a5568;font-size:14px;line-height:1.6;font-family:Arial,sans-serif;">
              We'll be in touch closer to your tour date with meeting location details and any weather updates. Questions? Just reply to this email or reach us at <a href="tel:410-357-1025" style="color:#2D5016;">410-357-1025</a>.
            </p>

            <p style="margin:0;color:#4a5568;font-size:16px;">
              See you on the water,<br>
              <strong style="color:#2D5016;">W.H. Peters Outdoor Adventures</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#2D5016;padding:24px 40px;border-radius:0 0 16px 16px;text-align:center;">
            <p style="margin:0 0 8px 0;color:#a8b89a;font-size:12px;font-family:Arial,sans-serif;">Ocean City, Maryland</p>
            <p style="margin:0;color:#a8b89a;font-size:12px;font-family:Arial,sans-serif;">
              <a href="mailto:info@petersoutdoor.com" style="color:#C9A84C;">info@petersoutdoor.com</a>
              &nbsp;·&nbsp;
              <a href="tel:410-357-1025" style="color:#C9A84C;">410-357-1025</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send confirmation email." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

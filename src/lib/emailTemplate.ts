/**
 * Shared email template utilities for W.H. Peters Outdoor Adventures.
 * All transactional emails use this wrapper for consistent branding.
 */

/** Returns the public site URL from env, with no trailing slash. */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://petersoutdoor.com").replace(/\/$/, "");
}

export function emailWrapper(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#2D5016;padding:28px 40px 24px;border-radius:16px 16px 0 0;text-align:center;">
            <p style="margin:0 0 2px;color:#C9A84C;font-size:10px;letter-spacing:4px;text-transform:uppercase;font-family:Arial,sans-serif;">W.H. Peters Outdoor Adventures</p>
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:bold;font-family:Georgia,serif;">${title}</h1>
            <p style="margin:6px 0 0;color:#a8c890;font-size:12px;font-family:Arial,sans-serif;letter-spacing:1px;">Ocean City, Maryland · Guided Kayak Eco-Tours</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px;">
            ${bodyHtml}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#2D5016;padding:24px 40px;border-radius:0 0 16px 16px;text-align:center;">
            <p style="margin:0 0 6px;color:#a8b89a;font-size:12px;font-family:Arial,sans-serif;">
              Questions? We're happy to help.
            </p>
            <p style="margin:0 0 10px;color:#a8b89a;font-size:12px;font-family:Arial,sans-serif;">
              <a href="mailto:info@petersoutdoor.com" style="color:#C9A84C;text-decoration:none;">info@petersoutdoor.com</a>
              &nbsp;·&nbsp;
              <a href="tel:410-357-1025" style="color:#C9A84C;text-decoration:none;">410-357-1025</a>
            </p>
            <p style="margin:0;color:#6b8a5a;font-size:11px;font-family:Arial,sans-serif;">
              &copy; ${new Date().getFullYear()} W.H. Peters Outdoor Adventures · Ocean City, MD
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Renders a two-column label/value row inside a details card */
export function detailRow(label: string, value: string, last = false): string {
  const border = last ? "" : "border-bottom:1px solid #e2ddd6;";
  return `
    <tr>
      <td style="padding:10px 0;${border}">
        <table width="100%"><tr>
          <td style="color:#6b7280;font-size:14px;font-family:Arial,sans-serif;vertical-align:top;">${label}</td>
          <td style="color:#2D5016;font-size:14px;font-weight:bold;font-family:Arial,sans-serif;text-align:right;vertical-align:top;">${value}</td>
        </tr></table>
      </td>
    </tr>`;
}

/** Wraps detail rows in a styled card */
export function detailCard(rows: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;border-radius:12px;margin-bottom:28px;">
      <tr><td style="padding:4px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${rows}
        </table>
      </td></tr>
    </table>`;
}

/** A gold certificate-style code badge */
export function certBadge(code: string, amount: number): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;border:2px solid #C9A84C;border-radius:16px;margin-bottom:28px;">
      <tr><td style="padding:32px;text-align:center;">
        <p style="margin:0 0 4px;color:#6b7280;font-size:11px;font-family:Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">Certificate Value</p>
        <p style="margin:0 0 20px;color:#2D5016;font-size:52px;font-weight:bold;font-family:Georgia,serif;">$${Number(amount).toFixed(0)}</p>
        <p style="margin:0 0 6px;color:#6b7280;font-size:11px;font-family:Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">Certificate Code</p>
        <div style="display:inline-block;background:#2D5016;border-radius:10px;padding:12px 28px;margin-bottom:16px;">
          <p style="margin:0;color:#C9A84C;font-size:24px;font-weight:bold;font-family:'Courier New',monospace;letter-spacing:3px;">${code}</p>
        </div>
        <p style="margin:0;color:#6b7280;font-size:13px;font-family:Arial,sans-serif;">Valid for any guided kayak eco-tour &nbsp;·&nbsp; No expiration date</p>
      </td></tr>
    </table>`;
}

/** Branded section heading */
export function sectionHeading(text: string): string {
  return `<p style="margin:0 0 10px;color:#2D5016;font-size:12px;font-weight:bold;font-family:Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">${text}</p>`;
}

/** Body paragraph */
export function para(text: string, extra = ""): string {
  return `<p style="margin:0 0 20px;color:#4a5568;font-size:15px;line-height:1.7;font-family:Arial,sans-serif;${extra}">${text}</p>`;
}

/** Green CTA button */
export function ctaButton(label: string, href: string): string {
  return `
    <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr><td style="background:#2D5016;border-radius:10px;padding:14px 32px;">
        <a href="${href}" style="color:#ffffff;font-size:15px;font-weight:bold;font-family:Arial,sans-serif;text-decoration:none;">${label}</a>
      </td></tr>
    </table>`;
}

/**
 * QR code check-in block.
 * checkinUrl is the full admin check-in URL — we pass it to a QR image service
 * so the <img src> is a plain HTTPS URL that email clients can fetch normally.
 * (Data URIs are stripped by Gmail and most other email clients.)
 */
export function qrCodeBlock(checkinUrl: string, identifier: string): string {
  const qrImageUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&color=2D5016&bgcolor=FFFFFF&data=${encodeURIComponent(checkinUrl)}`;
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;border:2px dashed #C9A84C;border-radius:16px;margin-bottom:28px;">
      <tr><td style="padding:28px;text-align:center;">
        <p style="margin:0 0 4px;color:#6b7280;font-size:11px;font-family:Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">Admin Check-In QR Code</p>
        <p style="margin:0 0 16px;color:#4a5568;font-size:13px;font-family:Arial,sans-serif;">Scan at the dock to verify this reservation</p>
        <img src="${qrImageUrl}" alt="Check-in QR code" width="200" height="200" style="display:block;margin:0 auto 12px;" />
        <p style="margin:0;color:#6b7280;font-size:11px;font-family:Arial,sans-serif;letter-spacing:1px;">Booking ref: <strong>${identifier}</strong></p>
      </td></tr>
    </table>`;
}

/** Signature block */
export const signature = `
  <p style="margin:28px 0 0;color:#4a5568;font-size:15px;font-family:Arial,sans-serif;line-height:1.6;">
    See you on the water,<br>
    <strong style="color:#2D5016;">W.H. Peters Outdoor Adventures</strong>
  </p>`;

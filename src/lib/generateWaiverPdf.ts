import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface WaiverData {
  fullName: string;
  email: string | null;
  tourDate: string | null;
  signatureData: string; // base64 PNG data URL
  createdAt: string;
  ipAddress: string | null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<h[23][^>]*>/gi, "\n\n")
    .replace(/<\/h[23]>/gi, "")
    .replace(/<p[^>]*>/gi, "\n")
    .replace(/<\/p>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function wrapText(text: string, font: Awaited<ReturnType<typeof PDFDocument.prototype.embedFont>>, fontSize: number, maxWidth: number): string[] {
  const lines: string[] = [];
  const paragraphs = text.split("\n");

  for (const para of paragraphs) {
    if (para.trim() === "") {
      lines.push("");
      continue;
    }
    const words = para.split(/\s+/);
    let current = "";
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      const width = font.widthOfTextAtSize(test, fontSize);
      if (width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
  }

  return lines;
}

export async function generateWaiverPdf(waiver: WaiverData, waiverContent: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const margin = 50;
  const pageWidth = 612; // Letter width
  const pageHeight = 792; // Letter height
  const contentWidth = pageWidth - margin * 2;

  let page = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const drawText = (text: string, opts: { font?: typeof helvetica; size?: number; color?: ReturnType<typeof rgb> } = {}) => {
    const font = opts.font ?? helvetica;
    const size = opts.size ?? 10;
    const color = opts.color ?? rgb(0, 0, 0);

    if (y < margin + 40) {
      page = doc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }

    page.drawText(text, { x: margin, y, size, font, color });
    y -= size + 4;
  };

  const drawLine = () => {
    if (y < margin + 20) {
      page = doc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    page.drawLine({
      start: { x: margin, y },
      end: { x: pageWidth - margin, y },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.7),
    });
    y -= 12;
  };

  // Header
  drawText("W.H. Peters Outdoor Adventures", { font: helveticaBold, size: 16, color: rgb(0.176, 0.314, 0.086) });
  y -= 4;
  drawText("Liability Waiver", { font: helveticaBold, size: 12, color: rgb(0.4, 0.4, 0.4) });
  y -= 8;
  drawLine();

  // Waiver content
  const plainText = stripHtml(waiverContent);
  const wrappedLines = wrapText(plainText, helvetica, 9, contentWidth);
  for (const line of wrappedLines) {
    if (y < margin + 40) {
      page = doc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    if (line === "") {
      y -= 6;
      continue;
    }
    // Check if it looks like a heading (starts with number + period or all caps)
    const isHeading = /^\d+\.\s/.test(line);
    page.drawText(line, {
      x: margin,
      y,
      size: isHeading ? 10 : 9,
      font: isHeading ? helveticaBold : helvetica,
      color: rgb(0, 0, 0),
    });
    y -= (isHeading ? 14 : 13);
  }

  y -= 10;
  drawLine();

  // Signer info
  drawText("Signer Information", { font: helveticaBold, size: 11 });
  y -= 4;
  drawText(`Name: ${waiver.fullName}`, { size: 10 });
  if (waiver.email) drawText(`Email: ${waiver.email}`, { size: 10 });
  if (waiver.tourDate) drawText(`Tour Date: ${waiver.tourDate}`, { size: 10 });
  drawText(`Signed: ${new Date(waiver.createdAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}`, { size: 10 });
  if (waiver.ipAddress) drawText(`IP Address: ${waiver.ipAddress}`, { size: 9, color: rgb(0.5, 0.5, 0.5) });

  y -= 10;

  // Signature
  if (waiver.signatureData) {
    drawText("Signature:", { font: helveticaBold, size: 10 });
    y -= 4;

    try {
      // Handle both data URL and raw base64
      const base64 = waiver.signatureData.includes(",")
        ? waiver.signatureData.split(",")[1]
        : waiver.signatureData;
      const sigBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const sigImage = await doc.embedPng(sigBytes);
      const sigDims = sigImage.scale(0.5);
      const sigWidth = Math.min(sigDims.width, contentWidth);
      const sigHeight = (sigWidth / sigDims.width) * sigDims.height;

      if (y - sigHeight < margin) {
        page = doc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }

      page.drawImage(sigImage, {
        x: margin,
        y: y - sigHeight,
        width: sigWidth,
        height: sigHeight,
      });
      y -= sigHeight + 10;
    } catch {
      drawText("[Signature image could not be rendered]", { size: 9, color: rgb(0.6, 0.3, 0.3) });
    }
  }

  // Footer
  y -= 10;
  drawLine();
  drawText("This is a digital record generated by W.H. Peters Outdoor Adventures.", { size: 8, color: rgb(0.5, 0.5, 0.5) });

  return doc.save();
}

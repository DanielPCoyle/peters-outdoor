import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateWaiverPdf } from "@/lib/generateWaiverPdf";

// Simple ZIP implementation using raw bytes (no extra dependency)
function createZip(files: { name: string; data: Uint8Array }[]): Uint8Array {
  const entries: { name: Uint8Array; data: Uint8Array; offset: number }[] = [];
  const parts: Uint8Array[] = [];
  let offset = 0;

  const encoder = new TextEncoder();

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    // Local file header
    const header = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true); // signature
    view.setUint16(4, 20, true); // version needed
    view.setUint16(6, 0, true); // flags
    view.setUint16(8, 0, true); // compression: stored
    view.setUint16(10, 0, true); // mod time
    view.setUint16(12, 0, true); // mod date
    view.setUint32(14, crc32(file.data), true); // crc32
    view.setUint32(18, file.data.length, true); // compressed size
    view.setUint32(22, file.data.length, true); // uncompressed size
    view.setUint16(26, nameBytes.length, true); // name length
    view.setUint16(28, 0, true); // extra length
    header.set(nameBytes, 30);

    entries.push({ name: nameBytes, data: file.data, offset });
    parts.push(header, file.data);
    offset += header.length + file.data.length;
  }

  // Central directory
  const cdStart = offset;
  for (const entry of entries) {
    const cd = new Uint8Array(46 + entry.name.length);
    const view = new DataView(cd.buffer);
    view.setUint32(0, 0x02014b50, true); // signature
    view.setUint16(4, 20, true); // version made by
    view.setUint16(6, 20, true); // version needed
    view.setUint16(8, 0, true); // flags
    view.setUint16(10, 0, true); // compression
    view.setUint16(12, 0, true); // mod time
    view.setUint16(14, 0, true); // mod date
    view.setUint32(16, crc32(entry.data), true); // crc32
    view.setUint32(20, entry.data.length, true); // compressed
    view.setUint32(24, entry.data.length, true); // uncompressed
    view.setUint16(28, entry.name.length, true); // name len
    view.setUint16(30, 0, true); // extra len
    view.setUint16(32, 0, true); // comment len
    view.setUint16(34, 0, true); // disk start
    view.setUint16(36, 0, true); // internal attrs
    view.setUint32(38, 0, true); // external attrs
    view.setUint32(42, entry.offset, true); // local header offset
    cd.set(entry.name, 46);
    parts.push(cd);
    offset += cd.length;
  }

  // End of central directory
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(4, 0, true); // disk number
  eocdView.setUint16(6, 0, true); // cd disk
  eocdView.setUint16(8, entries.length, true); // entries on disk
  eocdView.setUint16(10, entries.length, true); // total entries
  eocdView.setUint32(12, offset - cdStart, true); // cd size
  eocdView.setUint32(16, cdStart, true); // cd offset
  eocdView.setUint16(20, 0, true); // comment len
  parts.push(eocd);

  // Concatenate
  const totalLen = parts.reduce((s, p) => s + p.length, 0);
  const result = new Uint8Array(totalLen);
  let pos = 0;
  for (const part of parts) {
    result.set(part, pos);
    pos += part.length;
  }
  return result;
}

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export async function GET() {
  const waivers = await prisma.waiver.findMany({ orderBy: { createdAt: "desc" } });

  if (waivers.length === 0) {
    return NextResponse.json({ error: "No waivers to download." }, { status: 404 });
  }

  const contentRow = await prisma.settings.findUnique({ where: { key: "waiver_content" } });
  const waiverContent = contentRow?.value ?? "";

  const files: { name: string; data: Uint8Array }[] = [];

  for (const waiver of waivers) {
    const pdfBytes = await generateWaiverPdf(
      {
        fullName: waiver.fullName,
        email: waiver.email,
        tourDate: waiver.tourDate,
        signatureData: waiver.signatureData,
        createdAt: waiver.createdAt.toISOString(),
        ipAddress: waiver.ipAddress,
      },
      waiverContent,
    );
    const filename = `waiver-${waiver.fullName.replace(/\s+/g, "-").toLowerCase()}-${waiver.createdAt.toISOString().split("T")[0]}.pdf`;
    files.push({ name: filename, data: pdfBytes });
  }

  const zipBytes = createZip(files);
  const today = new Date().toISOString().split("T")[0];

  return new NextResponse(Buffer.from(zipBytes), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="waivers-${today}.zip"`,
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateWaiverPdf } from "@/lib/generateWaiverPdf";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const waiver = await prisma.waiver.findUnique({ where: { id } });
  if (!waiver) {
    return NextResponse.json({ error: "Waiver not found." }, { status: 404 });
  }

  // Get waiver content
  const contentRow = await prisma.settings.findUnique({ where: { key: "waiver_content" } });
  const waiverContent = contentRow?.value ?? "";

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

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

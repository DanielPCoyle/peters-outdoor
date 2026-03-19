import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { fullName, email, tourDate, signatureData } = await req.json();

  if (!fullName?.trim() || !signatureData) {
    return NextResponse.json({ error: "Full name and signature are required." }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    null;

  const waiver = await prisma.waiver.create({
    data: {
      fullName: fullName.trim(),
      email: email?.trim() || null,
      tourDate: tourDate || null,
      signatureData,
      ipAddress: ip,
    },
  });

  return NextResponse.json({ id: waiver.id });
}

export async function GET() {
  const waivers = await prisma.waiver.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      fullName: true,
      email: true,
      tourDate: true,
      ipAddress: true,
    },
  });

  return NextResponse.json(waivers);
}

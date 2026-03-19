import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const tour = await prisma.privateTour.findUnique({ where: { slug } });
  if (!tour) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (tour.status === "cancelled") return NextResponse.json({ error: "This booking link has been cancelled." }, { status: 410 });
  return NextResponse.json({ tour: { ...tour, price: Number(tour.price) } });
}

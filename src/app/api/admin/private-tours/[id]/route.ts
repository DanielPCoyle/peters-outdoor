import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { title, description, date, time, guests, price, location, notes, clientName, clientEmail, status } = body;

  const tour = await prisma.privateTour.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(date !== undefined && { date }),
      ...(time !== undefined && { time }),
      ...(guests !== undefined && { guests: Number(guests) }),
      ...(price !== undefined && { price: Number(price) }),
      ...(location !== undefined && { location }),
      ...(notes !== undefined && { notes }),
      ...(clientName !== undefined && { clientName }),
      ...(clientEmail !== undefined && { clientEmail }),
      ...(status !== undefined && { status }),
    },
  });

  return NextResponse.json({ tour: { ...tour, price: Number(tour.price) } });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.privateTour.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

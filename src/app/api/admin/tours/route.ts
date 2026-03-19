import { NextRequest, NextResponse } from "next/server";
import { createTour } from "@/lib/tourStore";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.tour.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: { _count: { select: { addOns: true } } },
    });
    const tours = rows.map((t) => ({
      id: t.id,
      name: t.name,
      tagline: t.tagline,
      description: t.description,
      price: Number(t.price),
      duration: t.duration,
      imageUrl: t.imageUrl,
      wildlife: t.wildlife,
      isActive: t.isActive,
      sortOrder: t.sortOrder,
      maxGuests: t.maxGuests,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      addOnCount: t._count.addOns,
    }));
    return NextResponse.json({ tours });
  } catch (err) {
    console.error("GET /api/admin/tours:", err);
    return NextResponse.json({ tours: [] });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, tagline, description, price, duration, imageUrl, wildlife, isActive, sortOrder, maxGuests } = body;

  if (!name || !tagline || !description || price == null || !imageUrl) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const tour = await createTour({
    name,
    tagline,
    description,
    price: Number(price),
    duration: duration ?? "2–3 hours",
    imageUrl,
    wildlife: Array.isArray(wildlife) ? wildlife : [],
    isActive: isActive !== false,
    sortOrder: Number(sortOrder) || 0,
    maxGuests: Number(maxGuests) || 8,
    privatePartyEnabled: false,
    privatePartyRate: null,
  });

  if (!tour) {
    return NextResponse.json({ error: "Failed to create tour." }, { status: 500 });
  }

  return NextResponse.json({ tour }, { status: 201 });
}

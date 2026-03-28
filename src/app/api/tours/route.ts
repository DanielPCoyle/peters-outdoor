import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.tour.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        addOns: {
          include: { addOn: true },
          orderBy: { addOn: { sortOrder: "asc" } },
        },
        timeSlots: {
          where: { isActive: true },
          orderBy: { time: "asc" },
        },
      },
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
      maxGuests: t.maxGuests ?? 8,
      privatePartyEnabled: t.privatePartyEnabled,
      privatePartyRate: t.privatePartyRate !== null ? Number(t.privatePartyRate) : null,
      location: t.location ?? null,
      locationUrl: t.locationUrl ?? null,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      addOns: t.addOns
        .filter((ta) => ta.addOn.isActive)
        .map((ta) => ({
          id: ta.addOn.id,
          name: ta.addOn.name,
          description: ta.addOn.description,
          price: Number(ta.addOn.price),
          isActive: ta.addOn.isActive,
          sortOrder: ta.addOn.sortOrder,
        })),
      timeSlots: t.timeSlots.map((s) => ({
        id: s.id,
        time: s.time,
        type: s.type as "specific" | "recurring",
        dates: s.dates,
        startDate: s.startDate ?? null,
        repeatEvery: (s.repeatEvery ?? null) as "daily" | "weekly" | "monthly" | null,
        repeatCount: s.repeatCount ?? null,
        isActive: s.isActive,
      })),
    }));

    return NextResponse.json({ tours });
  } catch (err) {
    console.error("GET /api/tours:", err);
    return NextResponse.json({ tours: [] });
  }
}

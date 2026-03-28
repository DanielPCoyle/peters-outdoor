import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/tours/duplicate-sunset
 *
 * One-time operation: duplicates each active non-sunset tour as a
 * "[Name] Sunset Tour" variant, then deactivates the standalone
 * "Sunset Kayak Tour" if it exists.
 */
export async function POST() {
  const tours = await prisma.tour.findMany({
    where: { isActive: true },
    include: { addOns: true },
  });

  const created: string[] = [];

  for (const t of tours) {
    // Skip if it's already a sunset tour or the standalone one
    if (t.name.toLowerCase().includes("sunset") || t.name.toLowerCase().includes("full moon")) {
      continue;
    }

    // Check if sunset variant already exists
    const sunsetName = `${t.name} — Sunset`;
    const existing = await prisma.tour.findFirst({ where: { name: sunsetName } });
    if (existing) continue;

    const newTour = await prisma.tour.create({
      data: {
        name: sunsetName,
        tagline: t.tagline,
        description: t.description,
        price: Number(t.price),
        duration: t.duration,
        imageUrl: t.imageUrl,
        wildlife: t.wildlife,
        isActive: true,
        sortOrder: t.sortOrder + 100, // place after the originals
        maxGuests: t.maxGuests,
        privatePartyEnabled: t.privatePartyEnabled,
        privatePartyRate: t.privatePartyRate ? Number(t.privatePartyRate) : null,
        location: t.location,
        locationUrl: t.locationUrl,
      },
    });

    // Copy add-on associations
    for (const ta of t.addOns) {
      await prisma.tourAddOn.create({
        data: { tourId: newTour.id, addOnId: ta.addOnId },
      }).catch(() => {}); // ignore if add-on doesn't exist
    }

    created.push(sunsetName);
  }

  // Deactivate standalone sunset tour
  const standalone = await prisma.tour.findFirst({
    where: { name: { contains: "Sunset Kayak Tour" } },
  });
  if (standalone) {
    await prisma.tour.update({
      where: { id: standalone.id },
      data: { isActive: false },
    });
  }

  return NextResponse.json({
    message: `Created ${created.length} sunset tour variants.`,
    created,
    deactivatedStandalone: !!standalone,
  });
}

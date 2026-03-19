import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function makeSlug(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  return (
    "prv-" +
    Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  );
}

export async function GET() {
  const tours = await prisma.privateTour.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ tours: tours.map((t) => ({ ...t, price: Number(t.price) })) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, date, time, guests, price, location, notes, clientName, clientEmail } = body;

  if (!title || !date || !price || !clientName || !clientEmail) {
    return NextResponse.json({ error: "title, date, price, clientName, and clientEmail are required." }, { status: 400 });
  }

  // Ensure slug is unique
  let slug = makeSlug();
  while (await prisma.privateTour.findUnique({ where: { slug } })) {
    slug = makeSlug();
  }

  const tour = await prisma.privateTour.create({
    data: {
      slug,
      title,
      description: description ?? "",
      date,
      time: time ?? null,
      guests: Number(guests) || 1,
      price: Number(price),
      location: location ?? null,
      notes: notes ?? null,
      clientName,
      clientEmail,
      status: "pending",
    },
  });

  return NextResponse.json({ tour: { ...tour, price: Number(tour.price) } }, { status: 201 });
}

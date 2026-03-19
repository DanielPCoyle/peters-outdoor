import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tourId } = await params;
  try {
    const timeSlots = await prisma.tourTimeSlot.findMany({
      where: { tourId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ timeSlots });
  } catch (err) {
    console.error("GET timeslots error:", err);
    return NextResponse.json({ error: "Failed to fetch time slots." }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tourId } = await params;
  try {
    const body = await req.json();
    const { time, type, dates, startDate, repeatEvery, repeatCount } = body as {
      time: string;
      type: "specific" | "recurring";
      dates?: string[];
      startDate?: string;
      repeatEvery?: string;
      repeatCount?: number;
    };

    if (!time) {
      return NextResponse.json({ error: "time is required." }, { status: 400 });
    }
    if (!type || !["specific", "recurring"].includes(type)) {
      return NextResponse.json({ error: "type must be 'specific' or 'recurring'." }, { status: 400 });
    }

    const timeSlot = await prisma.tourTimeSlot.create({
      data: {
        tourId,
        time,
        type,
        dates: type === "specific" ? (dates ?? []) : [],
        startDate: type === "recurring" ? (startDate ?? null) : null,
        repeatEvery: type === "recurring" ? (repeatEvery ?? null) : null,
        repeatCount: type === "recurring" ? (repeatCount ?? null) : null,
      },
    });
    return NextResponse.json({ timeSlot }, { status: 201 });
  } catch (err) {
    console.error("POST timeslot error:", err);
    return NextResponse.json({ error: "Failed to create time slot." }, { status: 500 });
  }
}

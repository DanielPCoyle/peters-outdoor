import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { time, type, dates, startDate, repeatEvery, repeatCount } = body as {
      time?: string;
      type?: "specific" | "recurring";
      dates?: string[];
      startDate?: string;
      repeatEvery?: string;
      repeatCount?: number;
    };

    const timeSlot = await prisma.tourTimeSlot.update({
      where: { id },
      data: {
        ...(time !== undefined && { time }),
        ...(type !== undefined && { type }),
        ...(type === "specific" && { dates: dates ?? [], startDate: null, repeatEvery: null, repeatCount: null }),
        ...(type === "recurring" && {
          dates: [],
          startDate: startDate ?? null,
          repeatEvery: repeatEvery ?? null,
          repeatCount: repeatCount ?? null,
        }),
        ...(type === undefined && dates !== undefined && { dates }),
        ...(type === undefined && startDate !== undefined && { startDate }),
        ...(type === undefined && repeatEvery !== undefined && { repeatEvery }),
        ...(type === undefined && repeatCount !== undefined && { repeatCount }),
      },
    });
    return NextResponse.json({ timeSlot });
  } catch (err) {
    console.error("PUT timeslot error:", err);
    return NextResponse.json({ error: "Failed to update time slot." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.tourTimeSlot.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE timeslot error:", err);
    return NextResponse.json({ error: "Failed to delete time slot." }, { status: 500 });
  }
}

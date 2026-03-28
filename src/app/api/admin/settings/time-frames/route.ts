import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface TimeFrameDefinition {
  name: string;
  startTime: string; // "06:00"
  endTime: string;   // "12:00"
  color: string;     // hex color for UI pills
}

const SETTINGS_KEY = "timeFrames";

const DEFAULT_TIME_FRAMES: TimeFrameDefinition[] = [
  { name: "Morning", startTime: "06:00", endTime: "12:00", color: "#f59e0b" },
  { name: "Afternoon", startTime: "12:00", endTime: "16:00", color: "#3b82f6" },
  { name: "Sunset", startTime: "16:00", endTime: "21:00", color: "#f97316" },
];

export async function GET() {
  try {
    const row = await prisma.settings.findUnique({ where: { key: SETTINGS_KEY } });
    const timeFrames: TimeFrameDefinition[] = row ? JSON.parse(row.value) : DEFAULT_TIME_FRAMES;
    return NextResponse.json({ timeFrames });
  } catch (err) {
    console.error("GET time-frames:", err);
    return NextResponse.json({ timeFrames: DEFAULT_TIME_FRAMES });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { timeFrames } = (await req.json()) as { timeFrames: TimeFrameDefinition[] };
    if (!Array.isArray(timeFrames)) {
      return NextResponse.json({ error: "timeFrames must be an array." }, { status: 400 });
    }
    await prisma.settings.upsert({
      where: { key: SETTINGS_KEY },
      update: { value: JSON.stringify(timeFrames) },
      create: { key: SETTINGS_KEY, value: JSON.stringify(timeFrames) },
    });
    return NextResponse.json({ timeFrames });
  } catch (err) {
    console.error("PUT time-frames:", err);
    return NextResponse.json({ error: "Failed to save time frames." }, { status: 500 });
  }
}

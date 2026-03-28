import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_TIME_FRAMES = [
  { name: "Morning", startTime: "06:00", endTime: "12:00", color: "#f59e0b" },
  { name: "Afternoon", startTime: "12:00", endTime: "16:00", color: "#3b82f6" },
  { name: "Sunset", startTime: "16:00", endTime: "21:00", color: "#f97316" },
];

export async function GET() {
  try {
    const row = await prisma.settings.findUnique({ where: { key: "timeFrames" } });
    const timeFrames = row ? JSON.parse(row.value) : DEFAULT_TIME_FRAMES;
    return NextResponse.json({ timeFrames });
  } catch {
    return NextResponse.json({ timeFrames: DEFAULT_TIME_FRAMES });
  }
}

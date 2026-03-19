import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  const { content } = await req.json();
  if (typeof content !== "string") {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }
  await prisma.settings.upsert({
    where: { key: "waiver_content" },
    update: { value: content },
    create: { key: "waiver_content", value: content },
  });
  return NextResponse.json({ success: true });
}

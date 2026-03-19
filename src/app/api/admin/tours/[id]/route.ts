import { NextRequest, NextResponse } from "next/server";
import { getTourById, updateTour, deleteTour } from "@/lib/tourStore";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tour = await getTourById(id);
  if (!tour) return NextResponse.json({ error: "Tour not found." }, { status: 404 });
  return NextResponse.json({ tour });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const tour = await updateTour(id, body);
  if (!tour) return NextResponse.json({ error: "Tour not found." }, { status: 404 });
  return NextResponse.json({ tour });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = await deleteTour(id);
  if (!ok) return NextResponse.json({ error: "Tour not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

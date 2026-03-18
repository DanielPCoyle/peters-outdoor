import { NextRequest, NextResponse } from "next/server";
import { getAddOnsForTour, setTourAddOns } from "@/lib/addOnStore";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const addOns = await getAddOnsForTour(id);
  return NextResponse.json({ addOns });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { addOnIds } = await req.json();
  if (!Array.isArray(addOnIds)) {
    return NextResponse.json({ error: "addOnIds must be an array." }, { status: 400 });
  }
  const ok = await setTourAddOns(id, addOnIds);
  if (!ok) return NextResponse.json({ error: "Failed to update add-ons." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { updateAddOn, deleteAddOn } from "@/lib/addOnStore";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const addOn = await updateAddOn(id, {
    ...(body.name !== undefined && { name: body.name.trim() }),
    ...(body.description !== undefined && { description: body.description.trim() }),
    ...(body.price !== undefined && { price: Number(body.price) }),
    ...(body.isActive !== undefined && { isActive: body.isActive }),
    ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
  });
  if (!addOn) return NextResponse.json({ error: "Add-on not found." }, { status: 404 });
  return NextResponse.json({ addOn });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = await deleteAddOn(id);
  if (!ok) return NextResponse.json({ error: "Add-on not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

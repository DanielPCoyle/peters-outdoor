import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const codes = await prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(codes);
}

export async function POST(req: NextRequest) {
  const { code, description, discountType, discountValue, maxUses, expiresAt } = await req.json();

  if (!code?.trim() || !discountType || discountValue == null) {
    return NextResponse.json({ error: "Code, type, and value are required." }, { status: 400 });
  }

  const existing = await prisma.discountCode.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (existing) {
    return NextResponse.json({ error: "A discount code with this name already exists." }, { status: 409 });
  }

  const record = await prisma.discountCode.create({
    data: {
      code: code.trim().toUpperCase(),
      description: description?.trim() || null,
      discountType,
      discountValue: parseFloat(discountValue),
      maxUses: maxUses ? parseInt(maxUses) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json(record, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (updates.isActive !== undefined) data.isActive = updates.isActive;
  if (updates.description !== undefined) data.description = updates.description || null;
  if (updates.discountValue !== undefined) data.discountValue = parseFloat(updates.discountValue);
  if (updates.maxUses !== undefined) data.maxUses = updates.maxUses ? parseInt(updates.maxUses) : null;
  if (updates.expiresAt !== undefined) data.expiresAt = updates.expiresAt ? new Date(updates.expiresAt) : null;

  const record = await prisma.discountCode.update({ where: { id }, data });
  return NextResponse.json(record);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  await prisma.discountCode.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

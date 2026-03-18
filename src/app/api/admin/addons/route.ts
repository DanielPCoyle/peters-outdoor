import { NextRequest, NextResponse } from "next/server";
import { getAllAddOns, createAddOn } from "@/lib/addOnStore";

export async function GET() {
  const addOns = await getAllAddOns();
  return NextResponse.json({ addOns });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, price, isActive, sortOrder } = body;
  if (!name || price == null) {
    return NextResponse.json({ error: "Name and price are required." }, { status: 400 });
  }
  const addOn = await createAddOn({
    name: name.trim(),
    description: (description ?? "").trim(),
    price: Number(price),
    isActive: isActive ?? true,
    sortOrder: Number(sortOrder) || 0,
  });
  if (!addOn) return NextResponse.json({ error: "Failed to create add-on." }, { status: 500 });
  return NextResponse.json({ addOn }, { status: 201 });
}

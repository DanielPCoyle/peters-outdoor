import { NextRequest, NextResponse } from "next/server";
import { getAllRequests, updateRequest } from "@/lib/giftCertStore";

export async function GET() {
  const requests = await getAllRequests();
  return NextResponse.json(requests);
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  const updated = await updateRequest(id, updates);
  if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(updated);
}

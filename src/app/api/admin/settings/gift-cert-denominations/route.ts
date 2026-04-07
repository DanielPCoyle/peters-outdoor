import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface GiftCertDenomination {
  label: string;
  value: number;
  sublabel: string;
}

const SETTINGS_KEY = "giftCertDenominations";

const DEFAULT_DENOMINATIONS: GiftCertDenomination[] = [
  { label: "$60",  value: 60,  sublabel: "1 Tour Guest" },
  { label: "$120", value: 120, sublabel: "2 Tour Guests" },
  { label: "$180", value: 180, sublabel: "3 Tour Guests" },
  { label: "Custom", value: 0, sublabel: "Enter any amount" },
];

export async function GET() {
  try {
    const row = await prisma.settings.findUnique({ where: { key: SETTINGS_KEY } });
    const denominations: GiftCertDenomination[] = row ? JSON.parse(row.value) : DEFAULT_DENOMINATIONS;
    return NextResponse.json({ denominations });
  } catch (err) {
    console.error("GET gift-cert-denominations:", err);
    return NextResponse.json({ denominations: DEFAULT_DENOMINATIONS });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { denominations } = (await req.json()) as { denominations: GiftCertDenomination[] };
    if (!Array.isArray(denominations)) {
      return NextResponse.json({ error: "denominations must be an array." }, { status: 400 });
    }
    await prisma.settings.upsert({
      where: { key: SETTINGS_KEY },
      update: { value: JSON.stringify(denominations) },
      create: { key: SETTINGS_KEY, value: JSON.stringify(denominations) },
    });
    return NextResponse.json({ denominations });
  } catch (err) {
    console.error("PUT gift-cert-denominations:", err);
    return NextResponse.json({ error: "Failed to save denominations." }, { status: 500 });
  }
}

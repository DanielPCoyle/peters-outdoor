import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import type { GiftCertDenomination } from "@/app/api/admin/settings/gift-cert-denominations/route";

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
    console.error("GET gift-cert-denominations (public):", err);
    return NextResponse.json({ denominations: DEFAULT_DENOMINATIONS });
  }
}

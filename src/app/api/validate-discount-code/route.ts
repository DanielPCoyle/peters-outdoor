import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ valid: false, error: "No code provided." });
  }

  const discount = await prisma.discountCode.findUnique({ where: { code } });

  if (!discount || !discount.isActive) {
    return NextResponse.json({ valid: false, error: "Invalid discount code." });
  }

  if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
    return NextResponse.json({ valid: false, error: "This discount code has expired." });
  }

  if (discount.maxUses && discount.usedCount >= discount.maxUses) {
    return NextResponse.json({ valid: false, error: "This discount code has reached its usage limit." });
  }

  return NextResponse.json({
    valid: true,
    code: discount.code,
    discountType: discount.discountType,
    discountValue: discount.discountValue,
    description: discount.description,
  });
}

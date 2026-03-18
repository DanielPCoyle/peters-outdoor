import { NextRequest, NextResponse } from "next/server";
import { getRequestByCode } from "@/lib/giftCertStore";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ valid: false, error: "No code provided." }, { status: 400 });
  }

  const cert = await getRequestByCode(code);

  if (!cert) {
    return NextResponse.json({ valid: false, error: "Gift certificate not found." });
  }
  if (cert.status === "redeemed") {
    return NextResponse.json({ valid: false, error: "This gift certificate has already been redeemed." });
  }
  if (cert.status === "pending_payment") {
    return NextResponse.json({ valid: false, error: "This gift certificate has not been paid for yet." });
  }
  if (cert.status !== "active") {
    return NextResponse.json({ valid: false, error: "This gift certificate is not valid." });
  }

  return NextResponse.json({ valid: true, id: cert.id, amount: cert.amount, code: cert.certificateCode });
}

import { NextRequest, NextResponse } from "next/server";
import { getSessionToken, COOKIE_NAME } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Admin credentials not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in .env.local." },
      { status: 503 }
    );
  }

  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const token = getSessionToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

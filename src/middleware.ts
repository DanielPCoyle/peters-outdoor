import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";

async function computeToken(password: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(password));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function isValidToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.ADMIN_SECRET ?? "peters-outdoor-change-me";
  if (!password) return false;
  const username = process.env.ADMIN_USERNAME ?? "";
  const expected = await computeToken(`${username}:${password}`, secret);
  return token === expected;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  if (pathname === "/admin/login") return NextResponse.next();
  if (pathname === "/api/admin/login") return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!(await isValidToken(token))) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

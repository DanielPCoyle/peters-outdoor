import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";
const PITCH_PASSWORD = "Paul2026";

function checkBasicAuth(req: NextRequest, password: string): boolean {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;
  try {
    const decoded = atob(header.slice(6));
    const supplied = decoded.includes(":") ? decoded.split(":").slice(1).join(":") : decoded;
    return supplied === password;
  } catch {
    return false;
  }
}

function basicAuthChallenge(realm: string): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${realm}", charset="UTF-8"`,
    },
  });
}

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

  if (pathname === "/pitch" || pathname.startsWith("/pitch/")) {
    if (!checkBasicAuth(req, PITCH_PASSWORD)) {
      return basicAuthChallenge("Peters Outdoor Pitch");
    }
    return NextResponse.next();
  }

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
    const redirectTarget = pathname + req.nextUrl.search;
    url.pathname = "/admin/login";
    url.search = "";
    url.searchParams.set("redirect", redirectTarget);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/pitch", "/pitch/:path*"],
};

import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const encoder = new TextEncoder();

function getSecret(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not set");
  return encoder.encode(secret);
}

interface SessionPayload {
  role?: string;
  sub?: string;
  exp?: number;
}

async function getSession(req: NextRequest): Promise<SessionPayload | null> {
  const cookieName = req.url.startsWith("https")
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
  const token = req.cookies.get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path === "/portal/login" || path === "/admin/login") return;

  if (path.startsWith("/admin")) {
    const session = await getSession(req);
    if (!session) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (path.startsWith("/portal")) {
    const session = await getSession(req);
    if (!session || session.role !== "member") {
      const loginUrl = new URL("/portal/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/api/admin/:path*"],
};

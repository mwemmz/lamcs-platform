import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = await getToken({ req });

  // Skip auth check for login pages
  if (path === "/portal/login" || path === "/admin/login") {
    return NextResponse.next();
  }

  // Admin routes: must be authenticated with admin role
  if (path.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Portal routes: must be authenticated with member role
  if (path.startsWith("/portal")) {
    if (!token || token.role !== "member") {
      const loginUrl = new URL("/portal/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/api/admin/:path*"],
};

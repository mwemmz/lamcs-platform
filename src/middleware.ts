import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const session = req.auth;

  if (path === "/portal/login" || path === "/admin/login") return;

  if (path.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }
    if (session.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (path.startsWith("/portal")) {
    if (!session || session.user?.role !== "member") {
      const loginUrl = new URL("/portal/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
});

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/api/admin/:path*"],
};

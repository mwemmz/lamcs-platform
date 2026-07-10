import { auth } from "@/lib/auth";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const auth = req.auth;

  if (path === "/portal/login" || path === "/admin/login") return;

  if (path.startsWith("/admin")) {
    if (!auth?.user?.role || auth.user.role !== "admin") {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return Response.redirect(loginUrl);
    }
  }

  if (path.startsWith("/portal")) {
    if (!auth?.user?.role || auth.user.role !== "member") {
      const loginUrl = new URL("/portal/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return Response.redirect(loginUrl);
    }
  }
});

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};

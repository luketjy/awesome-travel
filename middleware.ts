import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get("admin_token")?.value || "";

  // 1) Allow the login page itself without token
  if (pathname === "/admin") {
    // If already logged in, optionally send straight to dashboard
    if (token) {
      const url = new URL("/admin/dashboard", req.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 2) Protect all other /admin/* pages
  if (pathname.startsWith("/admin/")) {
    if (!token) {
      const url = new URL("/admin", req.url);
      // optional: preserve where user wanted to go
      url.searchParams.set("next", pathname + (search || ""));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // IMPORTANT: include both /admin root and subroutes
  matcher: ["/admin", "/admin/:path*"],
};

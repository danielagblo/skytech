import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Admin routes - let Next.js handle these normally
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/site") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico")
  ) {
    // allow public and asset routes through; dashboard is protected below
    return NextResponse.next();
  }
  // Protect dashboard routes: require an admin_session cookie
  if (pathname.startsWith("/dashboard")) {
    const session = request.cookies.get("admin_session");
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Redirect root to public site
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/site", request.url));
  }

  // Other public routes, redirect to /site with the path
  return NextResponse.redirect(new URL(`/site${pathname}`, request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

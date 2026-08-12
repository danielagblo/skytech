import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow common static file types and system routes to bypass redirection
  const isStaticAsset = /\.(png|jpg|jpeg|gif|svg|ico|webmanifest|pdf|txt)$/.test(pathname);

  if (
    isStaticAsset ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads")
  ) {
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

  // All other routes are public pages served at the root
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
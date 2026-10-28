import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { campaignIntentPath } from "./app/lib/analyticsNormalize";

const crmProtectedRoutes = [
  "/home",
  "/pipeline",
  "/tasks",
  "/leads",
  "/calendar",
  "/settings",
];

function hasValidCrmToken(token?: string) {
  if (!token) return false;
  if (token.startsWith("demo-")) {
    return process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH === "true";
  }
  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return false;
    const payload = JSON.parse(
      atob(encodedPayload.replace(/-/g, "+").replace(/_/g, "/"))
    ) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = (request.headers.get("host") || "").toLowerCase();
  const isCrmSubdomain = host.startsWith("crm.") || request.nextUrl.searchParams.get("__crm") === "1";
  const isCrmPath = pathname.startsWith("/crm");
  const isCrm = isCrmSubdomain || isCrmPath;

  // Allow static assets, next internal files, and public assets to pass through
  const isStaticAsset = /\.(png|jpg|jpeg|gif|svg|ico|webmanifest|pdf|txt)$/.test(pathname);
  if (
    isStaticAsset ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads")
  ) {
    return NextResponse.next();
  }

  // API routes always pass directly to route handlers
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // --- CRM SUBDOMAIN / PATH ROUTING & AUTH ---
  if (isCrm) {
    const effectivePath = isCrmPath ? (pathname.replace(/^\/crm/, "") || "/") : pathname;
    const token = request.cookies.get("skytech_access")?.value;
    const refreshToken = request.cookies.get("skytech_refresh")?.value;
    const authenticated = hasValidCrmToken(token) || hasValidCrmToken(refreshToken);
    const demoEnabled = process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH === "true";
    const guarded = crmProtectedRoutes.some((route) => effectivePath.startsWith(route));

    // Protected route without authentication
    if (guarded && !authenticated && !demoEnabled) {
      const loginUrl = new URL(isCrmSubdomain ? "/login" : "/crm/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Already authenticated and visiting login or otp
    if ((effectivePath === "/login" || effectivePath === "/verify-otp") && authenticated) {
      const homeUrl = new URL(isCrmSubdomain ? "/home" : "/crm/home", request.url);
      return NextResponse.redirect(homeUrl);
    }

    // Root path on CRM: redirect to home or login
    if (effectivePath === "/") {
      const targetUrl = new URL(
        authenticated ? (isCrmSubdomain ? "/home" : "/crm/home") : (isCrmSubdomain ? "/login" : "/crm/login"),
        request.url
      );
      return NextResponse.redirect(targetUrl);
    }

    // If on crm.skytechgh.com subdomain, rewrite path to /crm/...
    if (isCrmSubdomain && !isCrmPath) {
      return NextResponse.rewrite(new URL(`/crm${pathname}`, request.url));
    }

    return NextResponse.next();
  }

  // --- MAIN WEBSITE CMS & MARKETING ROUTING ---
  // Protect dashboard routes: require an admin_session cookie
  if (pathname.startsWith("/dashboard")) {
    const session = request.cookies.get("admin_session");
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Paid / social UTMs on the homepage go to intent pages (landing, internship, pricing)
  if (pathname === "/") {
    const intent = campaignIntentPath(request.nextUrl.searchParams);
    if (intent && intent !== "/") {
      const dest = request.nextUrl.clone();
      dest.pathname = intent;
      return NextResponse.redirect(dest);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

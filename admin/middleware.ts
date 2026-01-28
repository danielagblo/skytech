import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Admin routes - let Next.js handle these normally
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/site')
  ) {
    return NextResponse.next();
  }
  
  // For all other routes, redirect to /site
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/site', request.url));
  }
  
  // Other public routes, redirect to /site with the path
  return NextResponse.redirect(new URL(`/site${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

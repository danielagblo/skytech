import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/login", request.url));
  // expire cookie immediately
  res.headers.set(
    "Set-Cookie",
    "admin_session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax",
  );
  return res;
}

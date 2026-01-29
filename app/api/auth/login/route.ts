import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const username = String(form.get("username") || "");
  const password = String(form.get("password") || "");

  const expectedUser = process.env.ADMIN_USER || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD || "admin";

  if (username === expectedUser && password === expectedPass) {
    const res = NextResponse.redirect(new URL("/dashboard", request.url));
    // set a simple httpOnly cookie for the session (1 hour) with the username
    res.headers.set(
      "Set-Cookie",
      `admin_session=${encodeURIComponent(username)}; Path=/; HttpOnly; Max-Age=${60 * 60}; SameSite=Lax`,
    );
    return res;
  }

  // failed login -> redirect back to login with error
  return NextResponse.redirect(new URL("/login?error=1", request.url));
}

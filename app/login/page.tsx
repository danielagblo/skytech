import React, { Suspense } from "react";
import LoginErrorBanner from "./LoginErrorBanner";

export const metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-[-120px] bottom-[-80px] w-96 h-96 rounded-full bg-white/5 blur-2xl" />
      </div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
            ST
          </div>
          <div>
            <h2 className="text-xl font-bold">Admin Login</h2>
            <p className="text-sm text-slate-500">Sign in to access the dashboard</p>
          </div>
        </div>

        <Suspense fallback={null}>
          <LoginErrorBanner />
        </Suspense>

        <form method="post" action="/api/auth/login">
          <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
          <input
            name="username"
            type="text"
            required
            autoComplete="username"
            className="w-full rounded-lg border px-4 py-2 mb-3"
          />

          <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border px-4 py-2 mb-4"
          />

          <div className="flex items-center justify-between">
            <button className="px-4 py-2 bg-blue-700 text-white rounded-lg">Sign in</button>
            <a href="/" className="text-sm text-slate-500 hover:underline">
              Return to site
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

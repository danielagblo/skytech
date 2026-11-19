"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/analytics", label: "Traffic", icon: "📈" },
  { href: "/dashboard/submissions", label: "Contact leads", icon: "💬" },
  { href: "/dashboard/blog", label: "Insights", icon: "📝" },
  { href: "/dashboard/faqs", label: "FAQs", icon: "❓" },
  { href: "/dashboard/pricing", label: "Pricing", icon: "💰" },
  { href: "/dashboard/services", label: "Services", icon: "🛠️" },
  { href: "/dashboard/home-statements", label: "Home lines", icon: "🧾" },
  { href: "/dashboard/testimonials", label: "Testimonials", icon: "💬" },
  { href: "/dashboard/team", label: "Team", icon: "👥" },
  { href: "/dashboard/affiliates", label: "Partners", icon: "🤝" },
  { href: "/dashboard/gallery", label: "Gallery", icon: "📸" },
  { href: "/dashboard/internships", label: "Internships", icon: "🎓" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const siteName = "Skytech Ghana";
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
      <aside className="sticky top-0 flex h-screen w-72 flex-shrink-0 flex-col border-r border-slate-700 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
        <div className="flex-shrink-0 p-6 pb-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-xl shadow-lg">
              🚀
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-2xl font-extrabold text-transparent">
                {siteName}
              </h1>
              <p className="text-xs text-slate-400">Site admin</p>
            </div>
          </div>
        </div>

        <nav
          className="scrollbar-hide flex-1 space-y-1.5 overflow-y-auto px-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 ${
                  isActive
                    ? "scale-105 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/50"
                    : "text-slate-300 hover:translate-x-1 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex-shrink-0 border-t border-slate-700 p-6 pt-4">
          <button
            type="button"
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
              } finally {
                router.push("/login");
              }
            }}
            className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-red-700 hover:to-red-800 hover:shadow-xl"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-8 py-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-2xl font-extrabold text-transparent">
                Site admin
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">Content that appears on skytechgh.com</p>
            </div>
            <Link
              href="/"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              View site
            </Link>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

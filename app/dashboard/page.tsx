"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TrafficSummary {
  totalVisitors: number;
  totalPageViews: number;
  todayVisitors: number;
  todayPageViews: number;
  totalInteractions: number;
  bounceRate: number;
  conversionRate?: number;
  totalConversions?: number;
  engagementRate?: number;
  sources: Array<{ source: string; count: number }>;
  pages: Array<{ page: string; label?: string; count: number }>;
  insights?: Array<{ severity: string; title: string; action: string }>;
}

const siteLinks = [
  {
    href: "/dashboard/submissions",
    title: "Contact leads",
    body: "Progressive form on /contact",
    icon: "💬",
    color: "blue",
  },
  {
    href: "/dashboard/blog",
    title: "Insights",
    body: "Published on /insights, services, and the footer",
    icon: "📝",
    color: "amber",
  },
  {
    href: "/dashboard/faqs",
    title: "FAQs",
    body: "Shown on /pricing",
    icon: "❓",
    color: "violet",
  },
  {
    href: "/dashboard/testimonials",
    title: "Testimonials",
    body: "Customer stories on the homepage",
    icon: "⭐",
    color: "emerald",
  },
  {
    href: "/dashboard/team",
    title: "Team",
    body: "People cards on home and /about",
    icon: "👥",
    color: "purple",
  },
  {
    href: "/dashboard/affiliates",
    title: "Partners",
    body: "Partner logos on home and in the footer",
    icon: "🤝",
    color: "sky",
  },
  {
    href: "/dashboard/gallery",
    title: "Gallery",
    body: "Projects on /gallery and case studies",
    icon: "📸",
    color: "rose",
  },
  {
    href: "/dashboard/internships",
    title: "Internships",
    body: "Applications from /internship",
    icon: "🎓",
    color: "indigo",
  },
];

export default function DashboardPage() {
  const [traffic, setTraffic] = useState<TrafficSummary | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/analytics");
        const data = await res.json();
        if (active) setTraffic(data);
      } catch {
        // keep null
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const topSource = traffic?.sources?.[0]?.source || "—";
  const topPage = traffic?.pages?.[0]?.label || traffic?.pages?.[0]?.page || "—";
  const topInsight =
    traffic?.insights?.find((item) => item.severity === "opportunity") ||
    traffic?.insights?.find((item) => item.severity === "watch") ||
    traffic?.insights?.[0];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 shadow-sm">
        <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-extrabold text-transparent">
          Site overview
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          These tools update the live film site. Website and app offer prices stay on the invoice rate card.
        </p>
      </div>

      {topInsight ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Top insight</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">{topInsight.title}</h3>
              <p className="mt-2 text-sm text-slate-700">
                <span className="font-semibold">Next step:</span> {topInsight.action}
              </p>
            </div>
            <Link
              href="/dashboard/analytics"
              className="shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Full analysis →
            </Link>
          </div>
        </div>
      ) : null}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Website traffic</h2>
          <Link href="/dashboard/analytics" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            View analytics →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Sessions</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-xl shadow-sm">
                👥
              </div>
            </div>
            <div className="mt-2 text-4xl font-extrabold text-slate-900">{traffic?.totalVisitors ?? "—"}</div>
            <p className="mt-3 text-sm text-slate-500">{traffic?.todayVisitors ?? 0} today</p>
          </div>
          <div className="stat-card">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Page views</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-xl shadow-sm">
                👁️
              </div>
            </div>
            <div className="mt-2 text-4xl font-extrabold text-slate-900">{traffic?.totalPageViews ?? "—"}</div>
            <p className="mt-3 text-sm text-slate-500">{traffic?.todayPageViews ?? 0} today</p>
          </div>
          <div className="stat-card">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Lead rate</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-xl shadow-sm">
                🎯
              </div>
            </div>
            <div className="mt-2 text-4xl font-extrabold text-slate-900">{traffic?.conversionRate ?? 0}%</div>
            <p className="mt-3 text-sm text-slate-500">{traffic?.totalConversions ?? 0} form / WhatsApp / apply</p>
          </div>
          <div className="stat-card">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Top source</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 text-xl shadow-sm">
                🌐
              </div>
            </div>
            <div className="mt-2 truncate text-2xl font-extrabold capitalize text-slate-900">{topSource}</div>
            <p className="mt-3 truncate text-sm text-slate-500">Top page: {topPage}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900">What the admin controls</h3>
          <p className="mt-1 text-sm text-slate-500">Each tool maps to a live page on the site</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {siteLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-md"
            >
              <div className="text-2xl">{item.icon}</div>
              <div className="mt-3 font-bold text-slate-900">{item.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </Link>
          ))}
        </div>
        <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Pricing cards on home and /pricing use the invoice offer list in code. Edit those totals in the CRM offer files, not in this admin.
        </p>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dashboard Overview</h1>
        <p className="text-slate-600 mt-3 text-lg">Welcome back! Here's what's happening with your site.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Total Pages</div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-xl shadow-sm group-hover:shadow-md transition-shadow">📄</div>
          </div>
          <div className="text-4xl font-extrabold text-slate-900 mt-2">4</div>
          <p className="text-sm text-slate-500 mt-3">Home, About, Services, Contact</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-green-600 font-semibold">✓ All Active</span>
          </div>
        </div>
        <div className="stat-card group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Team Members</div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-xl shadow-sm group-hover:shadow-md transition-shadow">👥</div>
          </div>
          <div className="text-4xl font-extrabold text-slate-900 mt-2">3</div>
          <p className="text-sm text-slate-500 mt-3">Core team leads</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-blue-600 font-semibold">→ View All</span>
          </div>
        </div>
        <div className="stat-card group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Services</div>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-xl shadow-sm group-hover:shadow-md transition-shadow">⚙️</div>
          </div>
          <div className="text-4xl font-extrabold text-slate-900 mt-2">5</div>
          <p className="text-sm text-slate-500 mt-3">Active service offerings</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-emerald-600 font-semibold">✓ Published</span>
          </div>
        </div>
        <div className="stat-card group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Testimonials</div>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-xl shadow-sm group-hover:shadow-md transition-shadow">⭐</div>
          </div>
          <div className="text-4xl font-extrabold text-slate-900 mt-2">6</div>
          <p className="text-sm text-slate-500 mt-3">Client testimonials</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-amber-600 font-semibold">★ 5.0 Avg</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Quick Actions</h3>
            <p className="text-sm text-slate-500 mt-1">Jump to any section</p>
          </div>
          <span className="text-3xl">⚡</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link
            href="/dashboard/hero"
            className="group p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50/30"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:shadow-md transition-shadow">🖼️</div>
            <div className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">Home Hero</div>
            <p className="text-sm text-slate-600 mt-2">Manage homepage hero assets</p>
            <div className="mt-4 text-xs text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">→ Go to Hero</div>
          </Link>

          <Link
            href="/dashboard/gallery"
            className="group p-6 border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-white to-purple-50/30"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:shadow-md transition-shadow">📸</div>
            <div className="font-bold text-slate-900 text-lg group-hover:text-purple-600 transition-colors">Gallery</div>
            <p className="text-sm text-slate-600 mt-2">Manage project gallery</p>
            <div className="mt-4 text-xs text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">→ Go to Gallery</div>
          </Link>

          <Link
            href="/dashboard/pricing"
            className="group p-6 border-2 border-slate-200 rounded-xl hover:border-emerald-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-white to-emerald-50/30"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:shadow-md transition-shadow">💰</div>
            <div className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors">Pricing</div>
            <p className="text-sm text-slate-600 mt-2">Update rate card and packages</p>
            <div className="mt-4 text-xs text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">→ Go to Pricing</div>
          </Link>

          <Link
            href="/dashboard/blog"
            className="group p-6 border-2 border-slate-200 rounded-xl hover:border-amber-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-white to-amber-50/30"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:shadow-md transition-shadow">📝</div>
            <div className="font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">Blog</div>
            <p className="text-sm text-slate-600 mt-2">Manage blog posts</p>
            <div className="mt-4 text-xs text-amber-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">→ Go to Blog</div>
          </Link>

          <Link
            href="/dashboard/team"
            className="group p-6 border-2 border-slate-200 rounded-xl hover:border-slate-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50/30"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:shadow-md transition-shadow">👥</div>
            <div className="font-bold text-slate-900 text-lg group-hover:text-slate-600 transition-colors">Team</div>
            <p className="text-sm text-slate-600 mt-2">Manage team members</p>
            <div className="mt-4 text-xs text-slate-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">→ Go to Team</div>
          </Link>

          <Link
            href="/"
            className="group p-6 border-2 border-slate-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-white to-green-50/30"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:shadow-md transition-shadow">🌐</div>
            <div className="font-bold text-slate-900 text-lg group-hover:text-green-600 transition-colors">View Site</div>
            <p className="text-sm text-slate-600 mt-2">Visit public website</p>
            <div className="mt-4 text-xs text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">→ Open Site</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

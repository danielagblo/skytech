'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
  { href: '/dashboard/pages', label: 'Pages', icon: '📄' },
  { href: '/dashboard/submissions', label: 'Submissions', icon: '💬' },
  { href: '/dashboard/internships', label: 'Internships', icon: '🎓' },
  { href: '/dashboard/team', label: 'Team', icon: '👥' },
  { href: '/dashboard/services', label: 'Services', icon: '⚙️' },
  { href: '/dashboard/testimonials', label: 'Testimonials', icon: '⭐' },
  { href: '/dashboard/settings', label: 'Settings', icon: '🔧' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [siteName, setSiteName] = useState('SkyTech');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/content/settings', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (active && data?.siteName) setSiteName(data.siteName);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    loadSettings();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-r border-slate-700 flex flex-col sticky top-0 h-screen">
        {/* Fixed Header */}
        <div className="p-6 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-xl shadow-lg">
              🚀
            </div>
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">{siteName}</h1>
              <p className="text-xs text-slate-400">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto px-6 space-y-1.5 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/50 scale-105'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Fixed Logout Button */}
        <div className="p-6 pt-4 border-t border-slate-700 flex-shrink-0">
          <button
            onClick={async () => {
              try {
                await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
              } finally {
                router.push('/login');
              }
            }}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-8 py-5 shadow-sm sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Admin Dashboard</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage your website content</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

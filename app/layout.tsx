'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './globals.css';
import '../index.css';
import Footer from '../components/Footer';
import Header from '../components/Header';

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

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isSite = pathname?.startsWith('/site');
  const isLogin = pathname === '/login' || pathname?.startsWith('/login');

  return (
    <html lang="en">
      <head>
        <title>SkyTech Admin</title>
        <meta name="description" content="SkyTech Admin Dashboard" />
        <link rel="icon" href="/bricskylogo.png" />
        <link rel="apple-touch-icon" href="/bricskylogo.png" />
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17868191918"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17868191918');
          `}
        </script>
      </head>
      <body>
          {/* If we're rendering the public site under /site, don't include admin chrome */}
          {isLogin ? (
            <main className="min-h-screen">{children}</main>
          ) : isSite ? (
            <main className="min-h-screen">
              <Header />
              {children}
              <Footer />
            </main>
          ) : (
          <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
            {/* Sidebar */}
            <aside className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6 shadow-2xl border-r border-slate-700 flex flex-col sticky top-0 h-screen">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-xl shadow-lg">
                    🚀
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">SkyTech</h1>
                    <p className="text-xs text-slate-400">Admin Dashboard</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1.5">
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

              <div className="mt-auto pt-6 border-t border-slate-700">
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
        )}
        
      </body>
    </html>
  );
}

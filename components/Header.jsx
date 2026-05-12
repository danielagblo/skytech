"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header({ siteName = "Skytech Ghana" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nav = [
    { href: "/site", label: "Home" },
    { href: "/site/about", label: "About" },
    { href: "/site/services", label: "Services" },
    { href: "/site/case-studies", label: "Case Studies" },
    { href: "/site/pricing", label: "Pricing" },
    { href: "/site/blog", label: "Blog" },
    { href: "/site/faqs", label: "FAQs" },
    { href: "/site/internship", label: "Internship" },
  ];

  const isActive = (href) => pathname === href;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${(isScrolled || isOpen)
        ? "bg-white border-b border-slate-200/60 shadow-lg py-2"
        : "bg-transparent py-6"
        }`}
    >
      <nav className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/site" className="flex items-center gap-3 focus-ring rounded-xl flex-shrink-0">
          <span className={`relative overflow-hidden rounded-xl transition-all duration-300 ${(isScrolled || isOpen) ? "h-9 w-9" : "h-11 w-11"
            }`}>
            <Image
              src="/skytechlogoonly.png"
              alt={`${siteName} logo`}
              fill
              className="object-cover"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className={`block text-base sm:text-lg font-extrabold tracking-tight whitespace-nowrap transition-colors text-slate-900`}>
              {siteName}
            </span>
            <span className={`hidden sm:block text-xs font-semibold transition-colors text-slate-500`}>
              Web • Mobile • SEO
            </span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-2 text-sm font-semibold">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "px-3 py-2 rounded-xl transition-all duration-300 focus-ring",
                isActive(item.href)
                  ? "text-blue-700 bg-blue-50"
                  : "text-slate-700 hover:text-blue-700 hover:bg-slate-50",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* CTA Button - Hidden on Mobile/Tablet for cleaner look */}
          <div className="hidden lg:inline-flex">
            <Link
              href="/site/contact"
              className="btn-primary px-6 py-2.5 text-sm rounded-2xl focus-ring whitespace-nowrap"
            >
              Talk to us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            aria-label="Toggle navigation menu"
            className="lg:hidden group flex flex-col items-end space-y-1.5 focus-ring rounded-xl p-2 transition-colors hover:bg-black/5"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={`h-0.5 rounded-full transition-all duration-300 bg-slate-900 ${isOpen ? 'w-7 rotate-45 translate-y-2' : 'w-7'}`}></span>
            <span className={`h-0.5 rounded-full transition-all duration-300 bg-slate-900 ${isOpen ? 'opacity-0' : 'w-5'}`}></span>
            <span className={`h-0.5 rounded-full transition-all duration-300 bg-slate-900 ${isOpen ? 'w-7 -rotate-45 -translate-y-2' : 'w-7'}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-[60] flex flex-col p-4 animate-in fade-in slide-in-from-top duration-300">
          {/* Menu Header (Logo + Close) */}
          <div className="flex items-center justify-between py-2 mb-8">
            <Link href="/site" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
              <span className="relative h-8 w-8 bg-slate-950 rounded-xl overflow-hidden ring-1 ring-slate-900/10">
                <Image
                  src="/skytechlogoonly.png"
                  alt={`${siteName} logo`}
                  fill
                  className="object-contain p-1.5"
                />
              </span>
              <span className="text-slate-900 text-lg font-extrabold tracking-tight whitespace-nowrap">
                {siteName}
              </span>
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              className="p-3 bg-slate-50 rounded-2xl text-slate-900 active:scale-90 transition-all"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Menu Links */}
          <div className="flex-1 overflow-y-auto space-y-2 pb-10">
            {nav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "block px-4 py-4 rounded-2xl transition-all duration-300",
                  isActive(item.href)
                    ? "text-blue-700 bg-blue-50/80 font-bold text-xl"
                    : "text-slate-800 hover:bg-slate-50 text-xl font-medium",
                ].join(" ")}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-8 mt-4 border-t border-slate-100">
              <Link
                href="/site/contact"
                className="block btn-primary text-center px-6 py-5 rounded-2xl shadow-xl shadow-blue-600/10 active:scale-[0.98] transition-all text-lg"
                onClick={() => setIsOpen(false)}
              >
                Talk to us
              </Link>
            </div>
          </div>

          {/* Footer Info in Menu */}
          <div className="py-6 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-sm font-medium">Engineering Ghana's Digital Future</p>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header({ siteName = "SKYTECH GHANA" }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const nav = [
    { href: "/site", label: "Home" },
    { href: "/site/about", label: "About" },
    { href: "/site/services", label: "Web-Solutions" },
    { href: "/site/services/security-systems", label: "Security-Systems" },
    { href: "/site/pricing", label: "Pricing" },
    { href: "/site/internship", label: "Internship" },
    { href: "/site/contact", label: "Contact" },
  ];

  const isActive = (href) => pathname === href;
  const isHome = pathname === '/site';

  return (
    <header className="w-full z-50 relative bg-black">
      {/* Top Banner Ticker - Show on all pages */}
      <div className="bg-[#000] w-full h-[65px] flex items-center overflow-hidden whitespace-nowrap border-b border-white/5">
        <div className="animate-marquee inline-block text-[#FFF] font-inter text-lg md:text-xl tracking-[-0.06em] px-4">
          We help you rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparency. &nbsp;&nbsp;&nbsp;&nbsp; We help you rank no #1 on Google. Digital Business Development Solutions. Enterprise Security IT Services Risk Reduction, 100% Transparency.
        </div>
      </div>

      <nav className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo block */}
        <Link href="/site" className="flex items-center gap-3 group z-[60]">
          <Image
            src="/try1.png"
            alt="SKYTECH GHANA logo"
            width={800}
            height={300}
            sizes="107px"
            className="h-10 w-auto object-contain"
            priority
          />
          <span className="text-white font-inter text-xl font-bold tracking-wider uppercase">
            SKYTECH GHANA
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 font-inter text-sm font-semibold">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-white transition-colors duration-300 py-1 border-b-2 hover:text-white/80 ${
                isActive(item.href) ? "border-white" : "border-transparent"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          aria-label="Toggle navigation menu"
          className="lg:hidden flex flex-col items-center justify-center w-10 h-10 rounded-full focus-ring"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : 'mb-1.5'}`} />
          <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? 'opacity-0 w-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : 'mt-1.5'}`} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 bg-black z-[55] transition-all duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col h-full pt-24 pb-8 px-6 text-center space-y-6">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 p-3 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Links */}
          <div className="flex flex-col space-y-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xl font-medium py-3 text-white transition-all ${
                  isActive(item.href) ? "font-bold text-blue-400" : ""
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

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
    { href: "/site/contact", label: "Contact" },
  ];

  const isActive = (href) => pathname === href;

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-lg py-1" 
          : "bg-transparent py-4"
      }`}
    >
      <nav className="section-shell flex items-center justify-between">
        {/* Logo */}
        <Link href="/site" className="flex items-center gap-3 focus-ring rounded-xl">
          <span className={`relative overflow-hidden rounded-xl ring-1 transition-all duration-300 ${
            isScrolled ? "h-8 w-8 bg-slate-950 ring-slate-900/10" : "h-10 w-10 bg-white ring-white/10"
          }`}>
            <Image
              src="/bricskylogo.png"
              alt={`${siteName} logo`}
              fill
              className="object-contain p-1.5"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className={`block text-base sm:text-lg font-extrabold tracking-tight transition-colors ${
              isScrolled ? "text-slate-900" : "text-white"
            }`}>
              {siteName}
            </span>
            <span className={`hidden sm:block text-xs font-semibold transition-colors ${
              isScrolled ? "text-slate-500" : "text-white/70"
            }`}>
              Web • Mobile • SEO
            </span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2 text-sm font-semibold">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "px-3 py-2 rounded-xl transition-all duration-300 focus-ring",
                isActive(item.href)
                  ? (isScrolled ? "text-blue-700 bg-blue-50" : "text-white bg-white/10")
                  : (isScrolled ? "text-slate-700 hover:text-blue-700 hover:bg-slate-50" : "text-white/80 hover:text-white hover:bg-white/5"),
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="/site/contact"
          className="hidden md:inline-flex btn-primary px-5 py-2 rounded-2xl focus-ring"
        >
          Talk to us
        </Link>

        {/* Mobile Menu Button */}
        <button 
          aria-label="Toggle navigation menu"
          className="md:hidden flex flex-col space-y-1 focus-ring rounded-xl px-2 py-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`w-7 h-0.5 transition-all ${isScrolled || isOpen ? 'bg-slate-900' : 'bg-white'} ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-7 h-0.5 transition-all ${isScrolled || isOpen ? 'bg-slate-900' : 'bg-white'} ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-7 h-0.5 transition-all ${isScrolled || isOpen ? 'bg-slate-900' : 'bg-white'} ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-xl border-t border-slate-100 px-4 py-4 space-y-4 shadow-lg">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block px-3 py-2 rounded-xl transition-colors focus-ring",
                isActive(item.href)
                  ? "text-blue-700 bg-blue-50"
                  : "text-slate-800 hover:text-blue-700 hover:bg-slate-50",
              ].join(" ")}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link 
            href="/site/contact"
            className="block btn-primary text-center focus-ring"
            onClick={() => setIsOpen(false)}
          >
            Talk to us
          </Link>
        </div>
      )}
    </header>
  );
}

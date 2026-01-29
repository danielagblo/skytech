"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-sm">
      <nav className="section-shell flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/site" className="text-2xl font-extrabold tracking-tight text-blue-700">
          SkyTech
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-700">
          <Link href="/site" className="hover:text-blue-700 transition-colors">Home</Link>
          <Link href="/site/about" className="hover:text-blue-700 transition-colors">About</Link>
          <Link href="/site/services" className="hover:text-blue-700 transition-colors">Services</Link>
          <Link href="/site/contact" className="hover:text-blue-700 transition-colors">Contact</Link>
        </div>

        {/* CTA Button */}
        <Link 
          href="/site/contact"
          className="hidden md:inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:-translate-y-0.5 hover:bg-blue-800 active:translate-y-0"
        >
          Start a project
        </Link>

        {/* Mobile Menu Button */}
        <button 
          aria-label="Toggle navigation menu"
          className="md:hidden flex flex-col space-y-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`w-7 h-0.5 bg-slate-900 transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-7 h-0.5 bg-slate-900 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-7 h-0.5 bg-slate-900 transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-xl border-t border-slate-100 px-4 py-4 space-y-4 shadow-lg">
          <Link 
            href="/site" 
            className="block text-slate-800 hover:text-blue-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/site/about" 
            className="block text-slate-800 hover:text-blue-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/site/services" 
            className="block text-slate-800 hover:text-blue-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>
          <Link 
            href="/site/contact" 
            className="block text-slate-800 hover:text-blue-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link 
            href="/site/contact"
            className="block rounded-full bg-blue-700 text-white px-6 py-3 font-semibold text-center shadow-md shadow-blue-600/25 transition hover:bg-blue-800"
            onClick={() => setIsOpen(false)}
          >
            Start a project
          </Link>
        </div>
      )}
    </header>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const allFeatures = [
  {
    title: "Precision Engineering",
    desc: "High-fidelity codebases built for performance, security, and infinite scalability.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  },
  {
    title: "Forensic Audit",
    desc: "Deep data analysis to identify bottlenecks and optimize for maximum conversion.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )
  },
  {
    title: "Rapid Deployment",
    desc: "Agile workflows that get your MVP to market in weeks, not months.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "Dedicated Support",
    desc: "Round-the-clock monitoring and expert support to keep your systems running 24/7.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    title: "Modern Tech Stacks",
    desc: "Leveraging the latest technologies like Next.js, AI, and Cloud-native architectures.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  {
    title: "Strategic Growth",
    desc: "We align your digital product with your long-term business and revenue goals.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    title: "Data Security",
    desc: "ISO-grade security protocols ensuring your user data and platform remain bulletproof.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },
  {
    title: "SEO-First Build",
    desc: "Search-engine optimized from the first line of code for maximum organic visibility.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    title: "User-Centric UX",
    desc: "Research-driven interfaces designed to reduce friction and maximize user retention.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

export default function WhyChooseUsSection() {
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef(null);

  const visibleFeatures = showAll ? allFeatures : allFeatures.slice(0, 6);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const cards = el.querySelectorAll('.why-us-card');
    const headerItems = el.querySelectorAll('.text-center > *');
    if (cards.length === 0) return;

    // Set initial GSAP states dynamically
    gsap.set(cards, { opacity: 0, y: 20 });
    gsap.set(headerItems, { opacity: 0, y: 30 });
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=150px',
        toggleActions: 'play none none none',
      }
    });

    tl.to(headerItems, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' })
      .to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
      }, '-=0.25');

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [showAll]);

  return (
    <section ref={containerRef} className="py-10 bg-slate-50 relative overflow-hidden border-b border-slate-100">
      <div className="section-shell space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="pill border-blue-600/20 text-blue-600 bg-blue-50">WHY CHOOSE US</span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Advanced software engineering <br /> for market leaders.
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            We don't just build apps; we architect digital solutions that drive measurable business growth and long-term technical dominance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700">
          {visibleFeatures.map((item, idx) => (
            <div
              key={item.title}
              className="group flex items-start gap-6 p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 why-us-card"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                {item.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-bold overflow-hidden transition-all hover:pr-12 active:scale-95 shadow-xl shadow-slate-900/20"
          >
            <span className="relative z-10">{showAll ? "Show Less" : "Discover More"}</span>
            <div className="absolute right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>
      </div>
    </section>
  );
}

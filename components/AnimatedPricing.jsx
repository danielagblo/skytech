'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AnimatedPricing({ pricing }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const headerItems = el.querySelectorAll('.pricing-header > *');
    const cards = el.querySelectorAll('.pricing-card');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom-=150px',
        toggleActions: 'play none none none',
      }
    });

    // Set initial GSAP states dynamically
    gsap.set(headerItems, { opacity: 0, y: 20 });
    gsap.set(cards, { opacity: 0, y: 15 });

    tl.to(headerItems, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' })
      .to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.35');

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-slate-50" id="pricing">
      <div className="section-shell space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4 pricing-header">
          <span className="pill">Pricing</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1]">
            Simple Rate Card. <br />
            <span className="text-blue-600">Zero Surprises.</span>
          </h2>
          <p className="text-lg text-slate-600">
            Our pricing is transparent and based on real deliverables. Choose the package that fits your stage.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-6">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-[9px] font-extrabold uppercase tracking-widest shadow-xl shadow-slate-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Maintenance Covers All Site Offers
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[9px] font-extrabold uppercase tracking-widest shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Lowest rates compared to others like WopeDigital.com
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((pkg, idx) => (
            <div
              key={pkg.name}
              className={`group relative rounded-[2.5rem] p-10 transition-all duration-500 flex flex-col pricing-card ${pkg.featured || idx === 1
                ? "bg-slate-900 border-blue-600/30 shadow-2xl shadow-blue-500/10 scale-105 z-10"
                : "bg-white border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5"
                }`}
            >
              {/* Featured Badge */}
              {(pkg.featured || idx === 1) && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-blue-600/40">
                  Most Popular
                </div>
              )}

              <div className={`space-y-2 mb-8 ${pkg.featured || idx === 1 ? 'text-white' : 'text-slate-900'}`}>
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${pkg.featured || idx === 1 ? 'text-blue-400' : 'text-blue-600'}`}>
                  {pkg.interval || "3–8 weeks"} timeline
                </span>
                <h3 className="text-2xl font-extrabold tracking-tight">{pkg.name}</h3>
                <div className="pt-4 flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-sm font-bold ${pkg.featured || idx === 1 ? 'text-blue-400/50' : 'text-slate-400'}`}>GHS</span>
                    <span className="text-4xl font-extrabold">{pkg.price}</span>
                  </div>
                  <div className="flex items-baseline gap-1 opacity-60">
                    <span className="text-[10px] font-bold">USD</span>
                    <span className="text-lg font-extrabold">~${pkg.usd}</span>
                  </div>
                  {pkg.renewal && (
                    <div className={`mt-2 text-[9px] font-extrabold uppercase tracking-wider py-1.5 px-3 rounded-lg w-fit ${pkg.featured || idx === 1 ? 'bg-white/10 text-blue-300' : 'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}>
                      Renew: GHS {pkg.renewal} yearly
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 flex-grow">
                <ul className="space-y-3">
                  {pkg.highlights.map((item) => (
                    <li key={item} className={`flex items-center gap-3 text-sm ${pkg.featured || idx === 1 ? 'text-blue-100/70' : 'text-slate-600'}`}>
                      <svg className={`w-4 h-4 ${pkg.featured || idx === 1 ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Link
                  href="/site/contact"
                  className={`w-full inline-flex justify-center items-center px-6 py-4 rounded-2xl font-bold transition-all ${pkg.featured || idx === 1
                    ? 'bg-blue-600 text-white hover:bg-white hover:text-slate-900'
                    : 'bg-slate-50 text-slate-900 group-hover:bg-blue-600 group-hover:text-white'
                    }`}
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-16">
          <Link href="/site/pricing" className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-blue-600 hover:gap-3 transition-all">
            Not what you're looking for? View full catalog
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}


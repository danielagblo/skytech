"use client";
import React, { useState, useEffect, useRef } from "react";
import PDFViewer from "../../../components/PDFViewer";
import Link from "next/link";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PricingClient({ initialPricing }) {
  const [activeCategory, setActiveCategory] = useState("web");
  const containerRef = useRef(null);

  // Extract categories from initialPricing
  const categories = initialPricing.map(cat => ({
    id: cat.category,
    label: cat.label
  }));

  const currentCategoryData = initialPricing.find(cat => cat.category === activeCategory);
  const currentPackages = currentCategoryData?.packages || [];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const heroElements = el.querySelectorAll('.pricing-hero-el');
    const tabs = el.querySelectorAll('.pricing-tab');
    const cards = el.querySelectorAll('.pricing-card');
    const strategicItems = el.querySelectorAll('.strategic-item');

    // Set initial states
    gsap.set(heroElements, { opacity: 0, y: 35 });
    gsap.set(tabs, { opacity: 0, x: -20 });
    gsap.set(cards, { opacity: 0, y: 30 });
    gsap.set(strategicItems, { opacity: 0, y: 25 });

    // 1. Entrance for Hero
    gsap.to(heroElements, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.1 });

    // 2. Tabs ScrollTrigger animation
    gsap.to(tabs, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.category-tabs-container',
        start: 'top bottom-=100px',
        toggleActions: 'play reverse play reverse',
      }
    });

    // 3. Cards ScrollTrigger animation
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      stagger: 0.18,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.pricing-grid-container',
        start: 'top bottom-=200px',
        toggleActions: 'play reverse play reverse',
      }
    });

    // 4. Strategic Values ScrollTrigger animation
    gsap.to(strategicItems, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.strategic-values-container',
        start: 'top bottom-=200px',
        toggleActions: 'play reverse play reverse',
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Animate cards dynamically when switching categories
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('.pricing-card');
    if (cards.length > 0) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', overwrite: 'auto' }
      );
    }
  }, [activeCategory]);

  return (
    <main ref={containerRef} className="min-h-screen bg-white">
      {/* Hero Section (The Investment Manifesto) */}
      <section className="relative overflow-hidden bg-white text-slate-900 pt-32 pb-24 px-4 border-b border-slate-100">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute -left-10 top-0 h-[500px] w-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-[500px] w-[500px] bg-cyan-400/5 rounded-full blur-[120px]" />
        </div>

        <div className="section-shell relative space-y-10">
          <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-[0.2em] text-[10px] font-extrabold pricing-hero-el">Pricing</span>
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl lg:text-6xl leading-[1.1] tracking-tight text-slate-900 font-light pricing-hero-el">
              Clear <span className="font-extrabold">Pricing.</span> <br />
              <span className="text-blue-600 font-extrabold">No Hidden Fees.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-2xl pricing-hero-el">
              We offer fixed prices for our services. Choose a package that fits your needs and budget.
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="bg-slate-50 border-b border-slate-100 sticky top-[72px] z-30 category-tabs-container">
        <div className="section-shell">
          <div className="flex overflow-x-auto no-scrollbar gap-2 py-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`pricing-tab whitespace-nowrap px-6 py-3 rounded-full text-sm font-extrabold uppercase tracking-widest transition-all ${activeCategory === cat.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white text-slate-400 hover:text-slate-600 border border-slate-200"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <section className="py-24 bg-white pricing-grid-container">
        <div className="section-shell space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPackages.map((pkg, idx) => (
              <div
                key={pkg.name}
                className={`group relative p-8 rounded-[2rem] border transition-all duration-500 flex flex-col pricing-card ${pkg.featured
                  ? "bg-slate-950 text-white border-blue-600/30 shadow-2xl shadow-blue-600/10 scale-105 z-10"
                  : "bg-white border-slate-100 hover:border-blue-600/20 hover:shadow-2xl"
                  }`}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-blue-600/40">
                    Recommended
                  </div>
                )}

                <div className="space-y-2 mb-8">
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest ${pkg.featured ? "text-blue-400" : "text-blue-600"}`}>
                    {pkg.tier} Tier
                  </span>
                  <h3 className="text-xl font-extrabold tracking-tight leading-tight h-12 flex items-center">
                    {pkg.name}
                  </h3>
                  <div className="pt-4 flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xs font-bold ${pkg.featured ? "text-blue-400/50" : "text-slate-400"}`}>GHS</span>
                      <span className="text-3xl font-extrabold tracking-tighter">{pkg.price}</span>
                      {pkg.interval && <span className="text-xs font-medium opacity-60">/{pkg.interval}</span>}
                    </div>
                    <div className="flex items-baseline gap-1 opacity-60">
                      <span className="text-[10px] font-bold">USD</span>
                      <span className="text-lg font-extrabold">~${pkg.usd}</span>
                    </div>
                    {pkg.renewal && (
                      <div className={`mt-2 text-[9px] font-extrabold uppercase tracking-wider py-1.5 px-3 rounded-lg w-fit ${pkg.featured ? "bg-white/10 text-blue-300" : "bg-slate-50 text-slate-500 border border-slate-100"}`}>
                        Renew: GHS {pkg.renewal} / ${Math.round(parseInt(pkg.renewal.replace(/,/g, '')) / 14.5)} yearly
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6 flex-grow">
                  <p className={`text-[10px] font-extrabold uppercase tracking-widest ${pkg.featured ? "text-slate-400" : "text-slate-500"}`}>Technical Deliverables</p>
                  <ul className="space-y-3">
                    {pkg.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-xs font-medium">
                        <svg className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${pkg.featured ? "text-blue-400" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={pkg.featured ? "text-slate-300" : "text-slate-600"}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href="/site/contact"
                    className={`w-full inline-flex justify-center items-center px-6 py-4 rounded-xl font-extrabold text-xs transition-all ${pkg.featured
                      ? "bg-blue-600 text-white hover:bg-white hover:text-slate-900"
                      : "bg-slate-900 text-white hover:bg-blue-600"
                      }`}
                  >
                    Initiate Project
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Values */}
      <section className="py-24 bg-white border-t border-slate-50 strategic-values-container">
        <div className="section-shell">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "No Hidden Costs", desc: "What we quote is what you pay. We list everything included so there are no surprises." },
              { title: "Fair Pricing", desc: "We price based on the work required, not on what we think you can pay." },
              { title: "Grows With You", desc: "Start with what you need now. We can add features and expand as your business grows." }
            ].map(item => (
              <div key={item.title} className="space-y-4 strategic-item">
                <div className="h-1 w-12 bg-blue-600" />
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

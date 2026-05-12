"use client";
import React, { useState } from "react";
import PDFViewer from "../../../components/PDFViewer";
import Link from "next/link";

export default function PricingClient({ initialPricing }) {
  const [activeCategory, setActiveCategory] = useState("web");

  // Extract categories from initialPricing
  const categories = initialPricing.map(cat => ({
    id: cat.category,
    label: cat.label
  }));

  const currentCategoryData = initialPricing.find(cat => cat.category === activeCategory);
  const currentPackages = currentCategoryData?.packages || [];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section (The Investment Manifesto) */}
      <section className="relative overflow-hidden bg-white text-slate-900 pt-32 pb-24 px-4 border-b border-slate-100">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute -left-10 top-0 h-[500px] w-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-[500px] w-[500px] bg-cyan-400/5 rounded-full blur-[120px]" />
        </div>

        <div className="section-shell relative space-y-10">
          <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-[0.2em] text-[10px] font-extrabold">Investment Guide</span>
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl lg:text-6xl leading-[1.1] tracking-tight text-slate-900 font-light">
              Transparent <span className="font-extrabold">Pricing.</span> <br />
              <span className="text-blue-600 font-extrabold">Zero Surprises.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-2xl">
              From startups to global enterprises, we provide fixed-price engineering solutions designed for long-term scalability.
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="bg-slate-50 border-b border-slate-100 sticky top-[72px] z-30">
        <div className="section-shell">
          <div className="flex overflow-x-auto no-scrollbar gap-2 py-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-extrabold uppercase tracking-widest transition-all ${activeCategory === cat.id
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
      <section className="py-24 bg-white">
        <div className="section-shell space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPackages.map((pkg, idx) => (
              <div
                key={pkg.name}
                className={`group relative p-8 rounded-[2rem] border transition-all duration-500 flex flex-col ${pkg.featured
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

          {/* Expert Resource (The Prospectus) */}
          <div className="rounded-[3rem] border border-slate-100 bg-slate-50 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4 text-center md:text-left">
              <span className="text-blue-600 text-[10px] font-extrabold uppercase tracking-[0.3em]">Technical Deep-Dive</span>
              <h2 className="text-3xl font-extrabold text-slate-900">Download the Full Prospectus.</h2>
              <p className="text-slate-500 max-w-xl leading-relaxed">
                Need a granular breakdown of our methodologies, security protocols, and long-term support plans? Access our latest pricing and strategy guide.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <PDFViewer src="/static/pricing.pdf" label="Open Detailed Strategy Guide" />
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">
                Secure PDF • 19.3 MB • Updated May 2024
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Values */}
      <section className="py-24 bg-white border-t border-slate-50">
        <div className="section-shell">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Transparent Line-Items", desc: "No hidden costs. Every quote includes engineering, QA, and initial infrastructure deployment." },
              { title: "ROI-Centric Pricing", desc: "We price based on the technical complexity and the measurable business impact of the solution." },
              { title: "Architectural Scalability", desc: "Our models are designed to grow. Scale your investment as your product moves from MVP to Enterprise." }
            ].map(item => (
              <div key={item.title} className="space-y-4">
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

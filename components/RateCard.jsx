"use client";

import React, { useState } from "react";
import Link from "next/link";

const toNum = (v) => Number(String(v).replace(/,/g, "")) || 0;

export default function RateCard({ pricing }) {
  const categories = (pricing || []).map((c) => ({ id: c.category, label: c.label }));
  const [activeCat, setActiveCat] = useState(categories[0]?.id || "web");
  const [currency, setCurrency] = useState("ghs");

  const currentCat = (pricing || []).find((c) => c.category === activeCat);
  const packages = (currentCat?.packages || []).slice(0, 3);

  return (
    <div className="space-y-12 max-w-[1400px] mx-auto px-4">
      {/* Tab controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6 gap-6">
        <div className="flex items-center gap-6 font-inter text-sm sm:text-base font-semibold">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`pb-2 border-b-2 transition-all ${
                activeCat === cat.id
                  ? "text-[#1E5AC8] border-[#1E5AC8]"
                  : "text-slate-400 border-transparent hover:text-slate-600"
              }`}
            >
              {cat.label} Rates
            </button>
          ))}
        </div>

        <div className="flex items-center gap-5 font-inter text-sm font-bold">
          <button
            onClick={() => setCurrency("ghs")}
            className={`pb-1 border-b-2 transition-all uppercase ${
              currency === "ghs" ? "text-slate-900 border-[#1E5AC8]" : "text-slate-400 border-transparent"
            }`}
          >
            CEDI
          </button>
          <button
            onClick={() => setCurrency("usd")}
            className={`pb-1 border-b-2 transition-all uppercase ${
              currency === "usd" ? "text-slate-900 border-[#1E5AC8]" : "text-slate-400 border-transparent"
            }`}
          >
            USD
          </button>
        </div>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-6">
        {packages.map((pkg, idx) => {
          const isFeatured = pkg.featured || idx === 1; // Middle card or featured card is styled as blue
          const renewalUsd = Math.round(toNum(pkg.renewal) / 14.5);

          return (
            <div
              key={pkg.name}
              className={`rounded-3xl border-2 p-8 sm:p-10 flex flex-col justify-between relative transition-all duration-500 hover:shadow-2xl ${
                isFeatured
                  ? "border-[#1E5AC8] bg-[#1E5AC8] text-white shadow-xl shadow-blue-500/10 z-10"
                  : "border-slate-200 bg-white text-slate-900 shadow-sm"
              }`}
            >
              {/* Recommended Badge */}
              {isFeatured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-6 py-1.5 rounded-xl text-xs font-light border border-[#1E5AC8] shadow-sm uppercase tracking-wider font-inter">
                  RECOMMENDED
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold font-inter tracking-tight leading-tight">{pkg.name}</h3>
                  <div className={`mt-2 border-l-2 pl-4 py-1 ${isFeatured ? "border-white/50" : "border-slate-300"}`}>
                    <p className="font-semibold text-sm leading-tight opacity-90">{pkg.tier || "Startups & Small Businesses"}</p>
                    <p className={`text-xs mt-1 ${isFeatured ? "text-blue-200" : "text-[#1E5AC8]"}`}>Timeline: 1 week</p>
                  </div>
                </div>

                <ul className="space-y-3 font-inter text-sm">
                  {pkg.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-xs">✓</span>
                      <span className="leading-relaxed opacity-95">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Details */}
              <div className="pt-0 mt-5 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <div className={`w-24 h-px ${isFeatured ? "bg-white/30" : "bg-[#1E5AC8]"}`} />
                  <span className="text-5xl font-extrabold font-inter tracking-tight">
                    {currency === "ghs" ? pkg.price : pkg.usd}
                  </span>
                </div>
                
                <div className="pl-28 flex flex-col items-end space-y-1 font-inter text-xs leading-relaxed opacity-85 whitespace-nowrap">
                  <p className="italic">Renews only at {currency === "ghs" ? `Ghc ${pkg.renewal}` : `$${renewalUsd}`}/yr</p>
                  <p className="italic">Free regular maintenance</p>
                  <p className="italic">No hidden fees</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

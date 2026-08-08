"use client";

import { useState } from "react";

export interface Plan {
  name: string;
  audience: string;
  timeline?: string;
  features: string[];
  price: { GHC: string; USD: string };
  renewal: string;
  recommended: boolean;
}

export type Currency = "GHC" | "USD";

const DEFAULT_PLANS: Plan[] = [
  {
    name: "Basic Website Package",
    audience: "Startups & Small Businesses",
    timeline: "1 week delivery",
    features: [
      "5-6 Page Responsive site",
      "Home, About, Service, Contact",
      "Google indexing",
      "WhatsApp integration",
      "Google map & Social links",
      "1yr SSL + Domain + Hosting",
      "Responsive interface",
      "Admin dashboard",
    ],
    price: { USD: "500", GHC: "2,500" },
    renewal: "Renews only at Ghc 1,000/yr",
    recommended: false,
  },
  {
    name: "Standard Business Package",
    audience: "Growing Brands",
    timeline: "2-3 weeks delivery",
    features: [
      "Everything in basic",
      "Advanced SEO",
      "Custom contact forms",
      "Live chat system",
      "Testimonials, Portfolio, Gallery",
      "Blog with admin access (CMS)",
      "Analytics dashboard",
    ],
    price: { USD: "750", GHC: "6,500" },
    renewal: "Renews only at Ghc 1,500/yr",
    recommended: true,
  },
  {
    name: "Advanced Website Package",
    audience: "Enterprises & Agencies",
    timeline: "3-4 weeks delivery",
    features: [
      "Everything in standard",
      "Priority support",
      "Custom integrations",
      "Dedicated project manager",
      "Monthly performance report",
      "Multi-language support",
    ],
    price: { USD: "1,200", GHC: "9,500" },
    renewal: "Renews only at Ghc 2,500/yr",
    recommended: false,
  },
];

export default function PricingCards({
  currency = "GHC",
  plans = DEFAULT_PLANS,
}: {
  currency?: Currency;
  plans?: Plan[];
}) {
  const defaultIndex = Math.max(plans.findIndex((p) => p.recommended), 0);
  const [selected, setSelected] = useState(defaultIndex);

  return (
    <div className="mx-auto grid max-w-[80rem] grid-cols-1 gap-6 px-5 pb-16 pt-8 md:grid-cols-3 lg:px-8">
      {plans.map((plan, index) => {
        const isSelected = selected === index;
        const isRecommended = plan.recommended;

        return (
          <div
            key={index}
            onClick={() => setSelected(index)}
            className={`relative flex cursor-pointer flex-col overflow-hidden rounded-lg bg-white p-8 transition-all duration-300 ${
              isSelected
                ? "ring-2 ring-brand-600 shadow-lift"
                : "shadow-soft ring-1 ring-slate-200 hover:-translate-y-1 hover:shadow-lift"
            }`}
          >
            {/* Recommended badge */}
            {isRecommended && (
              <span className="absolute right-0 top-0 inline-flex items-center gap-1.5 rounded-bl-2xl bg-slate-950 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-widest text-white">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 3l1.1 4.1H18l-3.3 2.6 1.2 4.1-3-2.2-3 2.2 1.2-4.1L6 7.1h3.9L13 3z" />
                </svg>
                Recommended
              </span>
            )}

            {/* Body */}
            <div className="flex items-center justify-between">
              <h3 className={`font-display text-xl font-semibold ${isSelected ? "text-brand-700" : "text-slate-900"}`}>
                {plan.name}
              </h3>
            </div>
            <p className="mt-1 text-sm text-slate-500">{plan.audience}</p>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-1.5">
              <span className={`text-sm font-semibold ${isSelected ? "text-brand-600" : "text-slate-400"}`}>
                {currency}
              </span>
              <span className={`font-display text-5xl font-bold tracking-tight ${isSelected ? "text-brand-600" : "text-slate-900"}`}>
                {plan.price[currency]}
              </span>
            </div>
            {plan.timeline && <p className="mt-1 text-xs text-slate-400">{plan.timeline}</p>}

            <div className={`my-6 h-px ${isSelected ? "bg-brand-100" : "bg-slate-100"}`} />

            {/* Features */}
            <ul className="flex-1 space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${isSelected ? "bg-slate-950" : "bg-brand-100 text-brand-700"}`}>
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className={`text-sm leading-snug ${isSelected ? "text-slate-700" : "text-slate-600"}`}>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-8">
              <button type="button" className={`w-full ${isSelected ? "btn-primary" : "btn-secondary"}`}>
                Choose {plan.name.replace(" Package", "")}
              </button>
            </div>
            <p className="mt-4 text-center text-xs leading-relaxed whitespace-pre-line text-slate-400">
              {plan.renewal}
              {"\n"}Free regular maintenance · No hidden fees
            </p>
          </div>
        );
      })}
    </div>
  );
}
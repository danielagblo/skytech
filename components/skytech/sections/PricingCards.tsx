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
    <div className="mx-auto max-w-[80rem] px-5 pb-20 pt-8 lg:px-8">
    <div className="grid grid-cols-1 gap-px bg-[#E3DDD4] md:grid-cols-3">
      {plans.map((plan, index) => {
        const isSelected = selected === index;

        return (
          <div
            key={index}
            onClick={() => setSelected(index)}
            className={`relative flex cursor-pointer flex-col p-8 ${
              isSelected ? "bg-[#141413] text-white" : "bg-white text-[#141413]"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-xl font-medium leading-snug">{plan.name}</h3>
              {plan.recommended && (
                <span className={`shrink-0 text-[11px] font-medium uppercase tracking-[0.16em] ${isSelected ? "text-white/70" : "text-[#1E5AC8]"}`}>
                  Recommended
                </span>
              )}
            </div>
            <p className={`mt-2 text-sm ${isSelected ? "text-white/65" : "text-[#5C574F]"}`}>{plan.audience}</p>

            <div className="mt-8 flex items-baseline gap-2">
              <span className={`text-xs font-medium uppercase tracking-[0.14em] ${isSelected ? "text-white/60" : "text-[#5C574F]"}`}>
                {currency}
              </span>
              <span className="font-display text-5xl font-medium tracking-tight">
                {plan.price[currency]}
              </span>
            </div>
            {plan.timeline && (
              <p className={`mt-2 text-xs ${isSelected ? "text-white/55" : "text-[#6B6560]"}`}>{plan.timeline}</p>
            )}

            <div className={`my-6 h-px ${isSelected ? "bg-white/15" : "bg-[#E3DDD4]"}`} />

            <ul className="flex-1 space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`mt-2 h-1 w-1 shrink-0 ${isSelected ? "bg-white" : "bg-[#1E5AC8]"}`} />
                  <span className={`text-sm leading-snug ${isSelected ? "text-white/85" : "text-[#5C574F]"}`}>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <button
                type="button"
                className={`w-full rounded-full px-4 py-3.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-[#161616] text-white hover:bg-[#2a2a2a]"
                    : "border border-black/10 bg-white text-[#161616] hover:bg-black/5"
                }`}
              >
                Choose {plan.name.replace(" Package", "")}
              </button>
            </div>
            <p className={`mt-4 text-center text-xs leading-relaxed whitespace-pre-line ${isSelected ? "text-white/55" : "text-[#6B6560]"}`}>
              {plan.renewal}
              {"\n"}Free regular maintenance · No hidden fees
            </p>
          </div>
        );
      })}
    </div>
    </div>
  );
}

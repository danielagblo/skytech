"use client";

import { useState } from "react";
import Image from "next/image";
import PricingCards, { type Plan, type Currency } from "./PricingCards";
import WhyYouNeedUs from "./WhyYouNeedUs";

export interface PricingPackageData {
  name: string;
  tier: string;
  price: string;
  usd: string;
  renewal: string;
  interval?: string;
  featured?: boolean;
  highlights: string[];
}

export interface PricingCategoryData {
  category: string;
  label: string;
  packages: PricingPackageData[];
}

const CATEGORY_LABELS: Record<string, string> = {
  web: "Website",
  mobile: "Mobile App",
  marketing: "Marketing",
  branding: "Branding",
};

function toPlan(pkg: PricingPackageData): Plan {
  return {
    name: pkg.name,
    audience: pkg.tier,
    features: pkg.highlights || [],
    price: { GHC: pkg.price, USD: pkg.usd },
    renewal: pkg.renewal || "Free regular maintenance\nNo hidden fees",
    recommended: !!pkg.featured,
  };
}

function PricingModel({
  categories = [],
  showWhyYouNeedUs = true,
}: {
  categories?: PricingCategoryData[];
  showWhyYouNeedUs?: boolean;
}) {
  const [currency, setCurrency] = useState<Currency>("GHC");
  const [activeIndex, setActiveIndex] = useState(0);

  const items = categories.map((c, i) => ({
    key: c.category,
    label: `${CATEGORY_LABELS[c.category] || c.label} Rates`,
    index: i,
  }));

  const activeCategory = categories[activeIndex];
  const plans = activeCategory && activeCategory.packages.length > 0
    ? activeCategory.packages.map(toPlan)
    : [];

  return (
    <div className="bg-white">
      <div className="px-6 pt-16 md:pt-20">
        <div className="mx-auto grid max-w-[80rem] grid-cols-1 items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative">
            <span className="section-tag">Simple & transparent</span>
            <h2 className="section-title mt-3">
              Simple rate card with zero surprises
            </h2>
            <ul className="mt-6 space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                We do regular maintenance on your site at no fees
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                We program, we don&apos;t use templates or WordPress
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <Image
              src="/images/icons/stars-line-svgrepo-com.svg"
              alt="Award"
              width={200}
              height={200}
              className="h-40 w-40 object-contain opacity-90 lg:h-56 lg:w-56"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[80rem] flex-col gap-5 px-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveIndex(item.index)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                activeIndex === item.index
                  ? "bg-brand-600 text-white shadow-soft"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Currency toggle */}
        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1">
          {(["GHC", "USD"] as Currency[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              className={`rounded-full px-5 py-2 text-sm font-semibold uppercase transition-all duration-300 ${
                currency === c ? "bg-brand-600 text-white shadow-soft" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <PricingCards currency={currency} plans={plans} />
      {showWhyYouNeedUs && <WhyYouNeedUs />}
    </div>
  );
}

export default PricingModel;

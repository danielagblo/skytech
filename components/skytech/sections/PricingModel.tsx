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
  showIntro = true,
}: {
  categories?: PricingCategoryData[];
  showWhyYouNeedUs?: boolean;
  showIntro?: boolean;
}) {
  const [currency, setCurrency] = useState<Currency>("GHC");
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredCategories = categories.filter(c => c.category !== "branding");

  const items = filteredCategories.map((c, i) => ({
    key: c.category,
    label: `${CATEGORY_LABELS[c.category] || c.label} Rates`,
    index: i,
  }));

  const activeCategory = filteredCategories[activeIndex];
  const plans = activeCategory && activeCategory.packages.length > 0
    ? activeCategory.packages.map(toPlan)
    : [];

  return (
    <div className={`${showIntro ? "border-t border-[#E3DDD4]" : ""} bg-[#F6F4F0]`}>
      {showIntro && <div className="px-5 pt-24 md:px-8 md:pt-32">
        <div className="mx-auto grid max-w-[80rem] grid-cols-1 items-end gap-12 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <span className="eyebrow">Pricing</span>
            <h2 className="section-title mt-5 max-w-xl">
              A simple rate card, with nothing added later
            </h2>
            <ul className="mt-8 max-w-lg space-y-3 text-[#5C574F]">
              <li className="flex items-start gap-3 border-t border-[#E3DDD4] pt-3">
                <span className="mt-2 h-1 w-1 shrink-0 bg-[#1E5AC8]" />
                Regular maintenance on your site, at no extra fee
              </li>
              <li className="flex items-start gap-3 border-t border-[#E3DDD4] pt-3">
                <span className="mt-2 h-1 w-1 shrink-0 bg-[#1E5AC8]" />
                Written and programmed here. No templates, no WordPress
              </li>
            </ul>
          </div>
          <div className="hidden justify-end lg:flex">
            <Image
              src="/images/icons/stars-line-svgrepo-com.svg"
              alt=""
              width={160}
              height={160}
              className="h-28 w-28 object-contain opacity-80"
            />
          </div>
        </div>
      </div>}

      <div className={`mx-auto flex max-w-[80rem] flex-col gap-6 border-b border-[#E3DDD4] px-5 sm:flex-row sm:items-end sm:justify-between lg:px-8 ${showIntro ? "mt-12" : "pt-8"}`}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveIndex(item.index)}
              className={`-mb-px border-b pb-3 text-sm transition-colors ${
                activeIndex === item.index
                  ? "border-[#1E5AC8] font-medium text-[#141413]"
                  : "border-transparent text-[#6B6560] hover:text-[#141413]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {(["GHC", "USD"] as Currency[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              className={`-mb-px border-b pb-3 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${
                currency === c
                  ? "border-[#1E5AC8] text-[#141413]"
                  : "border-transparent text-[#6B6560] hover:text-[#141413]"
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

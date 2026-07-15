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
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 max-w-[3000px] items-center justify-center mt-8 md:grid-cols-2">
          <div className="max-md:relative">
            <p className="text-2xl uppercase md:text-4xl">SIMPLE RATE CARD <br />WITH ZERO SURPRISES</p>
            <div className="md:hidden max-md:absolute right-0 -top-2 flex h-[8vh] items-center justify-center">
              <Image
                src="/images/icons/stars-line-svgrepo-com.svg"
                alt="Award"
                width={80}
                height={80}
                className="h-full w-full object-contain"
              />
            </div>
            <ul className="leading-8 mt-4 pl-3">
              <li>&#10004; We do regular maintenance on your site at NO FEES</li>
              <li>&#10004; We program,we don&apos;t use template or wordpress.</li>
            </ul>
          </div>
          <div className="max-md:hidden flex h-[25vh] items-center justify-center md:h-[35vh]">
            <Image
              src="/images/icons/stars-line-svgrepo-com.svg"
              alt="Award"
              width={200}
              height={200}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 px-6 py-8 md:grid-cols-2 md:gap-0 md:px-12">
        <div>
          <p className="hover:underline underline-offset-[3px] text-gray-500 font-bold decoration-2 decoration-[#1E5AC8] cursor-pointer">
            {items.map((item, i) => (
              <span key={item.key}>
                {i > 0 && <span className="font-bold">&#10132;</span>}
                <span
                  onClick={() => setActiveIndex(item.index)}
                  className={activeIndex === item.index ? "text-[#1E5AC8] font-bold" : ""}
                >
                  {item.label}
                </span>
              </span>
            ))}
          </p>
        </div>
        <div className="flex flex-row gap-4 justify-start font-medium uppercase text-lg md:justify-end">
          <p
            className={
              "inline hover:underline underline-offset-4 text-gray-500 font-bold decoration-2 decoration-[#1E5AC8] cursor-pointer" +
              (currency === "GHC" ? " text-[#1E5AC8] underline" : "")
            }
            onClick={() => setCurrency("GHC")}
          >
            GHC
          </p>
          <p
            className={
              "inline hover:underline underline-offset-4 text-gray-500 font-bold decoration-2 decoration-[#1E5AC8] cursor-pointer" +
              (currency === "USD" ? " text-[#1E5AC8] underline" : "")
            }
            onClick={() => setCurrency("USD")}
          >
            USD
          </p>
        </div>
      </div>

      <PricingCards currency={currency} plans={plans} />
      {showWhyYouNeedUs && <WhyYouNeedUs />}
    </div>
  );
}

export default PricingModel;

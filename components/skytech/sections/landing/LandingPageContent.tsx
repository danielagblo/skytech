"use client";

import { useState } from "react";
import Image from "next/image";

import BottomSheet from "@/components/skytech/ui/BottomSheet";
import WhatsAppOfferForm from "@/components/skytech/sections/landing/WhatsAppOfferForm";
import ClientsCarousel from "@/components/skytech/sections/home/ClientsCarousel";
import AnimatedCounter from "@/components/skytech/sections/home/AnimatedCounter";
import type { HeroStat } from "@/app/lib/hero";

export interface Package {
  name: string;
  audience: string;
  timeline: string;
  features: { text: string; excluded?: boolean }[];
  price: string;
  renewal: string;
  featured?: boolean;
}

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
  marketing: "Marketing Rates",
  mobile: "Mobile App Rates",
  web: "Website Rates",
};

function PackageCard({ pkg, onSelect }: { pkg: Package; onSelect: (pkg: Package) => void }) {
  return (
    <div
      className={`w-full overflow-hidden rounded-sm bg-white shadow-lg ring-1 ring-black/5 ${
        pkg.featured ? "md:ring-2 md:ring-[#2f59c1]" : ""
      }`}
    >
      <div className="pb-0">
        <div className="mb-4 flex items-end gap-2 border-b border-slate-400">
          <Image
            src="/images/icons/stars-line-svgrepo-com.svg"
            alt="Stars and Lines"
            className="h-[3.75rem] w-[3.75rem] p-2 pb-0"
            width={240}
            height={240}
          />
          <p className="text-xs leading-snug text-slate-600">
            We&apos;ve got the best pricing relatively in the industry.
            <br />
            We use right technology, not WordPress or templates.
          </p>
        </div>

        <div className="p-3">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2f59c1]">
              <span className="text-lg font-bold text-white">
                <Image src="/images/images/logoLogo.png" alt="LogoLogo" width={60} height={60} className="h-[3.75rem] w-auto" />
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
              <p className="text-sm text-slate-700">{pkg.audience}</p>
              <p className="text-sm text-slate-700">
                Timeline: <span className="font-semibold text-[#2f59c1]">{pkg.timeline}</span>
              </p>
            </div>
          </div>

          <span className="mb-4 inline-block rounded-full bg-[#2f59c1] px-3 py-1 text-sm font-semibold text-white">
            Includes:
          </span>

          <ul className="mb-6 space-y-0.5">
            {pkg.features.map((f) => (
              <li key={f.text} className={`flex items-start gap-2 ml-2 text-sm ${f.excluded ? "line-through text-slate-400" : ""}`}>
                <svg
                  className={`mt-0.5 h-4 w-4 shrink-0 ${f.excluded ? "text-slate-300" : "text-[#2f59c1]"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          <div className="relative">
            <div className="flex items-center justify-end gap-3 mb-2">
              <div className="flex-1 h-px bg-[#1E5AC8]" />
              <span className="text-4xl font-black text-[#1E5AC8]">{pkg.price}</span>
            </div>
            {pkg.renewal && <p className="text-xs text-slate-600 text-right leading-5 whitespace-pre-line">{pkg.renewal}</p>}
            <p className="text-xs text-right text-slate-600">Free regular maintenance</p>
            <p className="text-xs text-right text-slate-600">No Hidden Fees</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSelect(pkg)}
        className="flex w-full items-center justify-between gap-4 bg-[#2f59c1] px-6 py-4 transition-colors hover:bg-[#274ba6] sm:px-8"
      >
        <span className="flex items-center whitespace-nowrap mr-4 gap-2 font-medium text-white">
          To select this offer
          <span className="rounded-full bg-white px-[0.1875rem] text-[#2f59c1]">&#10132;</span>
        </span>
        <span className="rounded-2xl w-full py-2 font-semibold text-lg text-white text-center bg-white/10 shadow-[-1px_-1px_3px_rgba(255,255,255)]">
          Click
        </span>
      </button>
    </div>
  );
}

interface Partner {
  name: string;
  logoUrl: string;
  colSpan?: number;
  rowSpan?: number;
  logoScale?: number;
  visible?: boolean;
}

export default function LandingPageContent({
  categories,
  partners,
  stats = [],
}: {
  categories: PricingCategoryData[];
  partners: Partner[];
  stats?: HeroStat[];
}) {
  // Try to find first category with packages to make it active, default to "web"
  const defaultCategory = categories.find(c => c.packages && c.packages.length > 0)?.category || "web";
  const [activeCategory, setActiveCategory] = useState<string>(defaultCategory);
  const [currency, setCurrency] = useState<"GHC" | "USD">("GHC");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const activeCategoryData = categories.find((cat) => cat.category === activeCategory);

  const packagesToDisplay: Package[] = (activeCategoryData?.packages || []).map((pkg) => {
    const features = (pkg.highlights || []).map((h) => {
      if (h.endsWith(" [EXCLUDED]")) {
        return { text: h.replace(" [EXCLUDED]", ""), excluded: true };
      }
      return { text: h };
    });

    const isUSD = currency === "USD";
    const priceStr = isUSD ? `USD ${pkg.usd || "0"}` : `GHC ${pkg.price || "0"}`;

    let renewalStr = "";
    if (pkg.renewal) {
      if (isUSD) {
        const numeric = parseInt(pkg.renewal.replace(/,/g, ""), 10);
        if (!isNaN(numeric)) {
          renewalStr = `Renews only at USD ${Math.round(numeric / 14)}/yr`;
        } else {
          renewalStr = pkg.renewal;
        }
      } else {
        renewalStr = `Renews only at GHC ${pkg.renewal}/yr`;
      }
    }

    return {
      name: pkg.name,
      audience: pkg.tier || "Skytech Ghana",
      timeline: pkg.interval || "1 - 2 weeks",
      features,
      price: priceStr,
      renewal: renewalStr,
      featured: !!pkg.featured,
    };
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50">
      <section className="relative w-full bg-slate-950 pt-[80px] md:pt-[110px]">
        <div className="relative w-full leading-none">
          <Image
            src="/images/images/landing-hero.jpg"
            alt="Skytech Ghana storefront"
            width={1024}
            height={339}
            priority
            sizes="100vw"
            className="block h-auto w-full object-contain"
          />
        </div>
        <div className="bg-[#2f59c1] px-1 py-2 text-center whitespace-nowrap">
          <p className="text-xs font-medium text-white sm:text-base">
            Get a website that helps your business rank no1# on Google search.
          </p>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="relative z-20 px-3 py-5 sm:px-6 sm:py-8 md:px-8">
          <div className="mx-auto max-w-[80rem]">
            <div className="grid grid-cols-4 gap-2 text-center sm:gap-6 md:gap-8">
              {stats.slice(0, 4).map((s) => (
                <div key={s.label} className="min-w-0 space-y-1 sm:space-y-2">
                  <p className="font-display text-3xl font-bold tracking-tighter text-slate-950 sm:text-6xl md:text-7xl">
                    <AnimatedCounter value={s.value} suffix={s.suffix} compact={s.compact} />
                  </p>
                  <p className="text-[10px] font-semibold uppercase leading-snug tracking-wide text-slate-500 sm:text-sm sm:tracking-[0.18em]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl py-6">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-bold tracking-wide text-slate-900">Our Partners</h3>
        </div>
        <ClientsCarousel partners={partners} />
      </section>

      <section
        className="relative bg-[#2f59c1] bg-cover bg-center py-10"
        style={{ backgroundImage: "url(/images/images/landingBG.png)" }}
      >
        <div className="absolute inset-0 bg-[#2f59c1]/85" />

        <div className="relative mx-auto max-w-6xl px-6">
          <h2 className="mx-auto mb-10 max-w-md text-center text-xl font-medium leading-snug text-white sm:max-w-2xl sm:text-3xl">
            <span className="max-sm:whitespace-nowrap">Explore our packages below and </span>
            <br className="sm:hidden" />
            <span className="max-sm:whitespace-nowrap"> select any one you prefer to continue to</span>
            <br className="sm:hidden" />
            <span className="max-sm:whitespace-nowrap"> our WhatsApp Chat</span>
          </h2>

          {/* Controls Bar */}
          <div className="mx-auto mb-10 flex max-w-md flex-col gap-6 sm:flex-row sm:items-center sm:justify-between md:max-w-none border-b border-white/20 pb-4">
            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-6">
              {["web", "mobile", "marketing"].map((catKey) => (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setActiveCategory(catKey)}
                  className={`pb-2 text-sm font-semibold transition-all duration-300 border-b-2 -mb-[18px] relative ${
                    activeCategory === catKey
                      ? "border-white text-white"
                      : "border-transparent text-white/60 hover:text-white hover:border-white/40"
                  }`}
                >
                  {CATEGORY_LABELS[catKey]}
                </button>
              ))}
            </div>

            {/* Currency toggle */}
            <div className="flex items-center gap-4">
              {(["GHC", "USD"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`pb-2 text-sm font-semibold uppercase transition-all duration-300 border-b-2 -mb-[18px] ${
                    currency === c
                      ? "border-white text-white"
                      : "border-transparent text-white/60 hover:text-white hover:border-white/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {packagesToDisplay.length === 0 ? (
            <div className="text-center py-16 text-white bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
              <p className="text-lg font-medium text-white/80">No packages available for this category yet.</p>
              <p className="text-sm text-white/60 mt-1">Please contact us on WhatsApp to discuss custom packages.</p>
            </div>
          ) : (
            <div className="mx-auto grid max-w-md grid-cols-1 gap-8 md:max-w-none md:grid-cols-3 md:items-start md:gap-6">
              {packagesToDisplay.map((pkg, i) => (
                <div key={`${pkg.name}-${i}`} className="w-full">
                  <PackageCard pkg={pkg} onSelect={setSelectedPackage} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <BottomSheet isOpen={!!selectedPackage} onClose={() => setSelectedPackage(null)}>
        {selectedPackage && (
          <WhatsAppOfferForm
            packageName={selectedPackage.name}
            packagePrice={selectedPackage.price}
            onClose={() => setSelectedPackage(null)}
          />
        )}
      </BottomSheet>
    </main>
  );
}

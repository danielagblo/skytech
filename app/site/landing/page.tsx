"use client";

import { useState } from "react";
import Image from "next/image";

import BottomSheet from "@/components/skytech/ui/BottomSheet";
import WhatsAppOfferForm from "@/components/skytech/sections/landing/WhatsAppOfferForm";

const SERVICES: string[] = [
  "Website design",
  "Mobile app design",
  "Custom software",
  "CCTV Installations",
  "Electric fencing",
  "Car tracking",
];

interface Package {
  name: string;
  audience: string;
  timeline: string;
  features: { text: string; excluded?: boolean }[];
  price: string;
  renewal: string;
  featured?: boolean;
}

const PACKAGES: Package[] = [
  {
    name: "Basic website package",
    audience: "Startups & Small Businesses",
    timeline: "1 - 2 weeks",
    features: [
      { text: "5 - 6 pages modern responsive website" },
      { text: "Homepage, About, Services, Contact" },
      { text: "Google indexing" },
      { text: "Whats app integration" },
      { text: "Google maps & social media links" },
      { text: "1year SSL + Domain + Hosting" },
      { text: "Responsive interface" },
      { text: "Admin panel", excluded: true },
    ],
    price: "GHC 1,500",
    renewal: "Renews only at GHC 1,000/yr",
  },
  {
    name: "Basic website package",
    audience: "Startups & Small Businesses",
    timeline: "1 - 2 weeks",
    features: [
      { text: "5 - 6 pages modern responsive website" },
      { text: "Homepage, About, Services, Contact" },
      { text: "Google indexing" },
      { text: "Whats app integration" },
      { text: "Google maps & social media links" },
      { text: "1year SSL + Domain + Hosting" },
      { text: "Responsive interface" },
      { text: "Admin panel" },
    ],
    price: "GHC 2,500",
    renewal: "Renews only at GHC 1,000/yr",
  },
  {
    name: "Standard Business Package",
    audience: "Most Popular - Growing Brands",
    timeline: "2-3 weeks",
    features: [
      { text: "Everything in basic" },
      { text: "Advanced SEO" },
      { text: "Custom contact forms" },
      { text: "Live chat system" },
      { text: "Testimonials, portfolio, gallery" },
      { text: "Blog with admin access (CMS)" },
      { text: "Analytics dashboard" },
    ],
    price: "GHC 6,500",
    renewal: "Renews only at GHC 1,500/yr",
    featured: true,
  },
];

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
              <li key={f.text} className={`flex items-start gap-2 ml-2 text-sm ${f.excluded ? "line-through" : ""}`}>
                &#9679;
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          <div className="relative">
            <div className="flex items-center justify-end gap-3 mb-2">
              <div className="flex-1 h-px bg-[#1E5AC8]" />
              <span className="text-4xl font-black text-[#1E5AC8]">GHC {pkg.price.split(" ")[1]}</span>
            </div>
            <p className="text-xs text-slate-600 text-right leading-5 whitespace-pre-line">{pkg.renewal}</p>
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

export default function LandingPage() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative">
        <div className="relative w-screen h-auto aspect-[3/1]">
          <Image
            src="/images/images/landingPageBanner.png"
            alt="Skytech Ghana"
            fill
            priority
            className="w-screen h-auto"
          />
        </div>
        <div className="bg-[#2f59c1] px-1 py-2 text-center whitespace-nowrap">
          <p className="text-xs font-medium text-white sm:text-base">
            Get a website that helps your business rank no1# on Google search.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-2 py-6 text-center sm:py-8">
        <h2 className="mb-3 font-medium text-slate-900 text-lg">Our services</h2>
        <ul className="mx-auto max-sm:grid grid-cols-3 flex max-w-xl flex-wrap justify-center gap-x-6 max-sm:gap-x-1 gap-y-1.5 text-sm text-slate-700 sm:text-base">
          {SERVICES.map((service) => (
            <li key={service} className="flex items-center gap-1 whitespace-nowrap">
              <span className="h-1 w-1 rounded-full bg-[#2f59c1]" />
              {service}
            </li>
          ))}
        </ul>
      </section>

      <hr className="mt-4 mb-1 border-gray-400 border w-screen overflow-x-hidden" />

      <section className="mx-auto max-w-4xl sm:px-6">
        <Image
          src="/images/images/sponsors/sponsorsBigPicture.png"
          alt="Sponsors"
          width={1200}
          height={400}
          className="w-screen"
        />

        <div className="mt-2 text-center">
          <p className="text-gray-700">
            We&apos;ve served many happy clients in 2+ countries
            <br />
            with over 1 million beneficiaries of our projects.
          </p>
          <h3 className="my-3 text-lg font-bold tracking-wide text-slate-900">LEGACY CLIENTS</h3>
        </div>
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

          <div className="mx-auto flex max-w-md flex-col gap-8 md:max-w-none md:flex-row md:items-start md:gap-6">
            {PACKAGES.map((pkg, i) => (
              <div key={`${pkg.name}-${i}`} className="md:flex-1">
                <PackageCard pkg={pkg} onSelect={setSelectedPackage} />
              </div>
            ))}
          </div>
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

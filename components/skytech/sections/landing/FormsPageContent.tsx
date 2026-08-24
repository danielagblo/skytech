"use client";

import Image from "next/image";

import WhatsAppOfferForm from "@/components/skytech/sections/landing/WhatsAppOfferForm";
import ClientsCarousel from "@/components/skytech/sections/home/ClientsCarousel";

interface Partner {
  name: string;
  logoUrl: string;
  colSpan?: number;
  rowSpan?: number;
  logoScale?: number;
  visible?: boolean;
}

export default function FormsPageContent({ partners }: { partners: Partner[] }) {
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

      <section className="mx-auto max-w-6xl py-4 sm:py-6">
        <div className="mb-3 text-center sm:mb-4">
          <h3 className="text-lg font-bold tracking-wide text-slate-900">Our Partners</h3>
        </div>
        <ClientsCarousel partners={partners} />
      </section>

      <section className="bg-white px-4 pb-10 pt-2 sm:px-6 sm:pb-14 sm:pt-4">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-8">
          <WhatsAppOfferForm showReturn={false} />
        </div>
      </section>
    </main>
  );
}

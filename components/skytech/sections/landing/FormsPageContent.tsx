"use client";

import { useEffect } from "react";
import Image from "next/image";

import { trackGtagPageView } from "@/app/lib/gtag";
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
  useEffect(() => {
    trackGtagPageView("/forms");
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-white">
      <section className="relative w-full bg-slate-950">
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
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-2 pt-6 sm:px-6 sm:pt-8">
        <div className="mb-4 text-center sm:mb-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Trusted by
          </h3>
        </div>
        <ClientsCarousel partners={partners} />
      </section>

      <section className="px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-6">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-8">
          <WhatsAppOfferForm
            extended
            showReturn={false}
            showWhatsAppLabel={false}
            subtitle="Kindly complete the form to proceed"
          />
        </div>
      </section>
    </main>
  );
}

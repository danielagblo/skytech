"use client";

import { useEffect } from "react";

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
      <section className="px-4 pb-4 pt-8 sm:px-6 sm:pt-12">
        <div className="mx-auto max-w-lg rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50 to-white p-5 shadow-xl shadow-emerald-900/5 sm:p-8">
          <WhatsAppOfferForm
            extended
            showReturn={false}
            showWhatsAppLabel={false}
            subtitle="Tell us a little about you. We'll take it from there."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
        <div className="mb-4 text-center sm:mb-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Trusted by
          </h3>
        </div>
        <ClientsCarousel partners={partners} />
      </section>
    </main>
  );
}

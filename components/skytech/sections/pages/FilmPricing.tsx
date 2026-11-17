"use client";

import ServiceOffers from "@/components/skytech/sections/ServiceOffers";
import { useRise } from "@/components/skytech/motion/useRise";

export default function FilmPricing({
  faqs = [],
  initial = "website",
}: {
  faqs?: Array<{ question: string; answer: string }>;
  initial?: string;
}) {
  const ref = useRise<HTMLDivElement>();

  return (
    <div ref={ref} className="px-5 pb-16 pt-2 md:px-8">
      <header data-rise className="max-w-2xl py-8 md:py-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">Pricing</p>
        <h1 className="mt-3 font-display text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl">
          Pick the service. Then the offer.
        </h1>
      </header>

      <div data-rise>
        <ServiceOffers initial={initial} syncUrl />
      </div>

      {faqs.length > 0 ? (
        <section data-rise className="mt-4 rounded-[28px] bg-white p-6 md:p-10">
          <h2 className="font-display text-3xl font-medium tracking-tight">Questions</h2>
          <div className="mt-6 divide-y divide-black/10">
            {faqs.slice(0, 6).map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="cursor-pointer list-none font-medium">{faq.question}</summary>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/60">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

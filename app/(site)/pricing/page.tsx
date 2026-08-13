import Image from "next/image";

import PricingModel from "@/components/skytech/sections/PricingModel";
import FAQSection from "@/components/skytech/sections/FAQ";
import { groupFAQs } from "@/components/skytech/sections/faqGroup";
import { getPricing } from "@/app/lib/pricing";
import { getFAQs } from "@/app/lib/faqs";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const [pricing, faqs] = await Promise.all([getPricing(), getFAQs()]);

  return (
    <div className="text-xl">
      {/* Banner Wrapper: dark background matching navbar to prevent white gaps, with top padding so image starts below navbar */}
      <div className="relative w-full bg-slate-950 pt-[60px] md:pt-[80px]">
        <div className="relative h-64 md:h-80 w-full">
          <Image
            src="/images/images/AboutBanner.png"
            alt="Pricing"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 -mt-20 md:-mt-32 bg-white p-6 text-center md:p-10 md:text-left">
        <div className="mx-auto max-w-5xl">
        <h1 className="section-title mt-3">
          Simple, Transparent Pricing <br className="hidden md:block" /> Built For Your Business
        </h1>
        <p className="mt-4 text-slate-500 text-sm md:text-base">No hidden fees, no surprise renewals — just honest rates for real, custom-built software.</p>
        </div>
      </div>

      <PricingModel categories={pricing} showWhyYouNeedUs={false} />

      <div className="bg-white px-6 pb-10 md:px-10">
        <FAQSection faqs={groupFAQs(faqs)} />
      </div>
    </div>
  );
}

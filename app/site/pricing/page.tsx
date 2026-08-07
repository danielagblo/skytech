import Image from "next/image";

import PricingModel from "@/components/skytech/sections/PricingModel";
import FAQSection from "@/components/skytech/sections/FAQ";
import { groupFAQs } from "@/components/skytech/sections/faqGroup";
import { getPricing } from "@/app/lib/pricing";
import { getFAQs } from "@/app/lib/faqs";

export default async function PricingPage() {
  const [pricing, faqs] = await Promise.all([getPricing(), getFAQs()]);

  return (
    <div className="text-xl">
      <Image
        src="/images/images/AboutBanner.png"
        alt="Pricing"
        width={1600}
        height={160}
        className="h-40 w-screen object-cover"
      />

      <div className="p-6 text-center md:p-10 md:text-left">
        <p className="pb-3 text-2xl uppercase md:text-4xl">
          Simple, Transparent Pricing <br className="hidden md:block" /> Built For Your Business
        </p>
        <p className="text-slate-500">No hidden fees, no surprise renewals — just honest rates for real, custom-built software.</p>
      </div>

      <PricingModel categories={pricing} showWhyYouNeedUs={false} />

      <div className="bg-white px-6 pb-10 md:px-10">
        <FAQSection faqs={groupFAQs(faqs)} />
      </div>
    </div>
  );
}

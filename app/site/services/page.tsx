import Image from "next/image";

import PricingModel from "@/components/skytech/sections/PricingModel";
import IndustryCards from "@/components/skytech/sections/web-solutions/IndustryCards";
import WorkingProcess from "@/components/skytech/sections/web-solutions/WorkingProcess";
import TargetMarketAudience from "@/components/skytech/sections/web-solutions/TargetMarket";
import { getPricing } from "@/app/lib/pricing";

export const dynamic = "force-dynamic";

export default async function WebSolutionsPage() {
  const pricing = await getPricing();

  return (
    <div className="overflow-x-hidden bg-white">
      <section className="relative overflow-hidden bg-slate-950 pt-28 pb-16 text-white md:pb-20">
        <Image
          src="/images/images/AboutBanner.png"
          alt="Web Solutions"
          width={1600}
          height={160}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-brand-600/40 blur-[120px]" />

        <div className="section-shell relative">
          <div className="max-w-2xl">
            <span className="pill">Web Solutions</span>
            <h1 className="font-display mt-5 text-4xl font-semibold uppercase leading-[1.1] text-white sm:text-5xl">
              INDUSTRIES WE SERVE
              <span className="block text-brand-400">DIGITAL SOLUTIONS</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              We specialize in areas that demand technical rigor, high availability,
              and absolute data integrity.
            </p>
          </div>
        </div>
      </section>

      <IndustryCards />
      <PricingModel categories={pricing} showWhyYouNeedUs={false} />
      <WorkingProcess />
      <TargetMarketAudience />
    </div>
  );
}
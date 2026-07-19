import Image from "next/image";

import PricingModel from "@/components/skytech/sections/PricingModel";
import IndustryCards from "@/components/skytech/sections/web-solutions/IndustryCards";
import WorkingProcess from "@/components/skytech/sections/web-solutions/WorkingProcess";
import WhyYouNeedUs from "@/components/skytech/sections/WhyYouNeedUs";
import TargetMarketAudience from "@/components/skytech/sections/web-solutions/TargetMarket";
import { getPricing } from "@/app/lib/pricing";

export default async function WebSolutionsPage() {
  const pricing = await getPricing();

  return (
    <div className="text-xl">
      <Image
        src="/images/images/AboutBanner.png"
        alt="About Us"
        width={1600}
        height={160}
        className="w-screen h-40 object-cover"
      />
      <div className="p-6 md:p-10">
        <p className="text-2xl uppercase pb-3 md:text-4xl">
          Industries we serve <br /> digital solutions
        </p>
        <p>
          We specialize in areas that demand technical rigor,
          <br /> high availability, and absolute data integrity.
        </p>
      </div>
      <IndustryCards />
      <PricingModel categories={pricing} showWhyYouNeedUs={false} />
      <WorkingProcess />
      <TargetMarketAudience />
      <div className="p-6 mt-0 mb-0 md:p-10 md:-mt-6 md:-mb-20">
        <p className="text-2xl uppercase pb-3 md:text-4xl">
          WHY WE&apos;RE THE PREFERRED CHOICE FOR <br />
          DIGITAL BUSINESS DEVELOPMENT SERVICE{" "}
        </p>
        <p>Our work ethics stem from 4 cardinal principles</p>
      </div>

      <WhyYouNeedUs />
    </div>
  );
}

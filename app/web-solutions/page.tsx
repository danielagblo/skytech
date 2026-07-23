'use client'

import Image from "next/image";

import PricingModel from "@/components/sections/PricingModel";

import aboutBanner from "@/assets/images/AboutBanner.png"
import IndustryCards from "@/components/sections/web-solutions/IndustryCards";
import WorkingProcess from "@/components/sections/web-solutions/WorkingProcess";
import WhyYouNeedUs from "@/components/sections/WhyYouNeedUs";
import TargetMarketAudience from "@/components/sections/web-solutions/TargetMarket";


function WebSolutionsPage() {
  return (
    <div className="text-xl">
      <Image
        src={aboutBanner}
        alt="About Us"
        className="w-screen h-40 object-cover"
      />
      <div className="p-6 md:p-10">
        <p className="text-2xl uppercase pb-3 md:text-4xl">Industries we serve <br /> digital solutions</p>
        <p>We specialize in areas that demand technical rigor,<br /> high availability, and absolute data integrity.</p>
      </div>
      <IndustryCards />
      <PricingModel showWhyYouNeedUs={false}/>
      <WorkingProcess />
      <TargetMarketAudience />
      <div className="p-6 mt-0 mb-0 md:p-10 md:-mt-6 md:-mb-20">
        <p className="text-2xl uppercase pb-3 md:text-4xl">WHY WE’RE THE PREFERRED CHOICE FOR <br />DIGITAL BUSINESS DEVELOPMENT SERVICE </p>
        <p>Our work ethics stem from 4 cardinal principles</p>
      </div>

      <WhyYouNeedUs />
    </div>
  )
}

export default WebSolutionsPage

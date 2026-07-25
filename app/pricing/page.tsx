'use client'

import Image from "next/image"

import PricingModel from "@/components/sections/PricingModel"
import FAQSection from "@/components/sections/FAQ"

import aboutBanner from "@/assets/images/AboutBanner.png"

function PricingPage() {
  return (
    <div className="text-xl">
      <Image
        src={aboutBanner}
        alt="Pricing"
        className="w-screen h-40 object-cover"
      />

      <div className="p-6 text-center md:p-10 md:text-left">
        <p className="text-2xl uppercase pb-3 md:text-4xl">Simple, Transparent Pricing <br className="hidden md:block" /> Built For Your Business</p>
        <p>No hidden fees, no surprise renewals — just honest rates for real, custom-built software.</p>
      </div>

      <PricingModel />

      <div className="bg-white px-6 pb-10 md:px-10">
        <FAQSection />
      </div>
    </div>
  )
}

export default PricingPage

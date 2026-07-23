'use client';

import Image from "next/image";

import TopScrollingBanner from "@/components/sections/home/TopScrollingBanner";
import LandingScreen from "@/components/sections/home/LandingScreen";
import SponsorCarousel from "@/components/sections/home/SponsorCarousel";
import PricingModel from "@/components/sections/PricingModel";

import globeImage from "../assets/images/globeImage.png";
import workWithUsImage from "../assets/images/workWithUs.png";

import LetsTalkButton from "@/components/ui/LetsTalkButton";
import TestimonialsBanner from "@/components/sections/home/TestimonialsBanner";
import FAQSection from "@/components/sections/FAQ";
import AwardsStatement from "@/components/sections/AwardsStatement";
import FlagsList from "@/components/ui/FlagsList";

const services = [
  {
    title: "website development",
    list: [
      "corporate business",
      "e-commerce",
      "blog content",
      "e-learning"
    ]
  }, {
    title: "mobile app development",
    list: [
      "corporate business",
      "e-commerce",
      "blog content",
      "e-learning"
    ]
  }, {
    title:"IT installations",
    list: [
      "POS (Point of Sale) systems",
      "Wi-Fi Network Connection",
      "CCTV surveillance systems",
      "inverter & solar panel",
      "door and alarm installation"
    ]
  }
]

export default function Home() {
  return (
    <div>
      <div className="fixed top-0 w-screen z-20">
        <TopScrollingBanner />
      </div>
      <LandingScreen />
      <hr
        className="h-6 w-screen bg-black"
      />

      <p className="p-6 w-screen text-center font-medium bg-white text-lg md:p-10 md:text-2xl">
        WE’RE TRUSTED BY OVER <span className="font-semibold text-[#1E5AC8]">1000+ BRANDS </span>
      </p>

      <div className="bg-white">
        <SponsorCarousel />
      </div>

      <AwardsStatement />

      <div className="relative w-screen h-[30vh] overflow-hidden md:h-[42.5vh]">
        <Image
          src={globeImage}
          alt="Globe"
          priority
          className="h-full w-full object-cover md:h-auto md:w-auto md:object-fill"
        />

        <div className="absolute top-4 right-4 z-10 text-sm md:top-8 md:right-12 md:text-xl">
          <p className="text-white">IT Connecting Across Borders</p>

          <FlagsList />
        </div>
      </div>


      <div className="pt-10 px-6 bg-white md:pt-15">
        <p className="text-2xl uppercase md:text-4xl">What services do we<br/> offer best</p>
        <div className="grid grid-cols-1 gap-4 max-w-[3000px] items-start justify-center mt-8 md:grid-cols-3">
          {
            services.map((service, index) => (
              <div key={index} className="bg-[#f6f6f6] relative pb-22.5 p-6 h-full border-t-5 border-[#1E5AC8]">
                <p className="text-xl font-semibold uppercase">{service.title}</p>
                <div className="pr-4">
                  <hr className="text-[#1E5AC8]" />
                  <ul className="mt-4 capitalize leading-7 text-lg">
                    {
                      service.list.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))
                    }
                  </ul>
                </div>
                <div 
                  className="absolute bg-white bottom-5 border rounded-full py-2 px-3 border-[#1E5AC8] right-7 hover:bg-gray-100 cursor-pointer hover:scale-97 active:scale-102 transition-all duration-300"
                  onClick={() => {}}
                >
                  &#10132;
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <PricingModel />

      <TestimonialsBanner />

      <div className="bg-white px-6 pt-14 md:px-10 md:pt-20">
        <div className="relative bg-[#016DAB] rounded-2xl flex flex-col items-center justify-center overflow-hidden py-10 md:flex-row md:items-center md:justify-end md:overflow-visible md:pr-40 md:pt-5">
          <Image
            src={workWithUsImage}
            alt="Work With Us"
            className="static mb-4 h-40 w-40 object-contain md:absolute md:-left-15 md:-bottom-50 md:mb-0 md:h-190 md:w-190"
          />
          <LetsTalkButton className="bg-white/20 text-white md:my-30" />
        </div>
        <FAQSection />
      </div>
      
    </div>
  );
}




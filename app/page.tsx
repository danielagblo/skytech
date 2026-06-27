'use client';

import Image from "next/image";

import TopScrollingBanner from "@/components/sections/home/TopScrollingBanner";
import LandingScreen from "@/components/sections/home/LandingScreen";
import SponsorCarousel from "@/components/sections/home/SponsorCarousel";

import awardImage from "../assets/images/homePageAward.png";
import globeImage from "../assets/images/globeImage.png";

import ghanaFlag from "../assets/icons/GhanaFlag.svg";
import kenyaFlag from "../assets/icons/KenyaFlag.svg";
import USFlag from "../assets/icons/USFlag.svg";
import UKFlag from "../assets/icons/UKFlag.svg";
import nigeriaFlag from "../assets/icons/NigeriaFlag.svg";
import PricingModel from "@/components/sections/PricingModel";

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
    <div className="overflow-x-hidden">
      <TopScrollingBanner />
      <LandingScreen />

      <hr 
        className="h-6 w-screen bg-black"
      />

      <p className="p-6 w-screen text-center font-medium bg-white text-lg">
        WE’RE TRUSTED BY OVER <span className="font-semibold text-[#1E5AC8]">1000+ BRANDS </span>
      </p>

      <SponsorCarousel />

      <div className="my-8 flex flex-row items-center justify-between w-screen h-[50vh] bg-[#f1f1f1]">
        <div className="w-[66vw] pl-6 pr-30">
          <p className="subtitle">2+ TOP AWARDS</p>
          <p className="text-4xl uppercase">Recognition for digital excellence</p>
          <p className="mt-7 pr-10">
            Our commitment to delivering exceptional digital business
            development and other IT Services has made us an 
            award-winning agency trusted by businesses worldwide.
          </p>
        </div>
        <div className="w-[34vw] h-full flex flex-1 items-center justify-center pr-20">
          <div className="bg-[#d9d9d9] rounded-full aspect-square p-8 flex items-center justify-center">
            <div className="bg-[#f1f1f1] rounded-full aspect-square p-2">
              <div className="border-2 border-[#d9d9d9]  rounded-full aspect-square">
                <Image 
                  src={awardImage}
                  alt="Award"
                  className="aspect-square object-contain -mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-screen h-[42.5vh] overflow-hidden">
        <Image
          src={globeImage}
          alt="Globe"
          priority
        />

        <div className="absolute top-8 right-12 z-10 text-xl">
          <p className="text-white">IT Connecting Across Borders</p>

          <div className="flex flex-row gap-2 items-center justify-end">
            {
              [
                ghanaFlag,
                kenyaFlag, 
                USFlag,
                UKFlag,
                nigeriaFlag
              ].map((flag, index) => (
                <div key={index} className="w-9 h-9 rounded-full overflow-hidden">
                  <Image
                    key={index}
                    src={flag}
                    alt={`Flag ${index}`}
                    className="w-full h-full object-cover scale-135"
                  />
                </div>
              ))
            }
          </div>
        </div>
      </div>


      <div className="pt-15 px-6">
        <p className="text-4xl uppercase">What services do we<br/> offer best</p>
        <div className="grid grid-cols-3 gap-4 max-w-[3000px] items-start justify-center mt-8">
          {
            services.map((service, index) => (
              <div key={index} className="bg-[#f6f6f6] relative pb-22.5 p-6 h-full border-t-5 border-[#1E5AC8]">
                <p className="text-xl font-semibold uppercase">{service.title}</p>
                <div className="pr-4">
                  <hr className="text-[#1E5AC8]" />
                  <ul className="mt-4 capitalize leading-7">
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
    </div>
  );
}




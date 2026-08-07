"use client";

import { useState } from "react";
import Image from "next/image";

import TopScrollingBanner from "@/components/skytech/sections/home/TopScrollingBanner";
import CCTVSurveillance from "./CCTVSurveillance";
import GPSTracking from "./GPSTracking";
import BiometricAndAutomatedGate from "./BiometricAndAutomatedGate";
import CyberSecurity from "./CyberSecurity";
import MobileTracking from "./MobileTracking";
import HardwareProcurementAndSupply from "./HardwareProcurementAndSupply";

const cards = [
  {
    name: "CCTV Surveillance",
    title: "CCTV Surveillance Camera Installation",
    component: <CCTVSurveillance />,
  },
  {
    name: "GPS Tracking",
    title: "GPS Tracking Solutions",
    component: <GPSTracking />,
  },
  {
    name: "Biometric & Automated Gates",
    title: "Biometric & Automated Gate Systems",
    component: <BiometricAndAutomatedGate />,
  },
  {
    name: "Cyber Security",
    title: "Cyber Security Solutions",
    component: <CyberSecurity />,
  },
  {
    name: "Mobile Tracking",
    title: "Mobile Tracking Solutions",
    component: <MobileTracking />,
  },
  {
    name: "Hardware Procurement & Supplying",
    title: "Hardware Procurement & Supplying",
    component: <HardwareProcurementAndSupply />,
  },
];

interface SecurityCard {
  name: string;
  title: string;
  component: React.ReactNode;
}

function SecuritySystemsPage() {
  const [activeTab, setActiveTab] = useState<SecurityCard>(cards[0]);

  return (
    <>
      <div className="md:fixed top-0 w-screen z-20">
        <TopScrollingBanner className="bg-[#031B41] text-white p-3 flex items-center justify-center max-md:pt-11 " />
      </div>
      <div className="relative overflow-x-hidden">
        <Image
          src="/images/images/securitySystemsBannerImage.png"
          alt="Banner Image"
          width={1600}
          height={800}
          className="w-screen h-auto"
          loading="eager"
          priority
        />
        <div className="px-4 pt-4 pb-2 md:hidden">
          <label htmlFor="security-service" className="mb-2 block font-semibold text-gray-900">
            Choose a Security Service:
          </label>
          <select
            id="security-service"
            value={activeTab.name}
            onChange={(e) => {
              const selected = cards.find((c) => c.name === e.target.value) ?? cards[0];
              setActiveTab(selected);
            }}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
          >
            {cards.map((card) => (
              <option key={card.name} value={card.name}>
                {card.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden px-4 py-4 items-center justify-center max-md:pt-11 md:flex md:absolute md:top-[27.5vh] md:w-screen md:px-0 md:py-0">
          <div className="grid grid-cols-2 gap-3 w-full md:grid-cols-3 md:gap-6 md:w-auto">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`text-white rounded-2xl bg-brand-600 md:bg-white/15 md:backdrop-blur-md
                  min-h-20 p-3 md:p-0 md:min-w-[22vw] md:min-h-[12vw] md:max-w-[19.375rem] md:max-h-[8.75rem]
                  flex justify-center max-md:pt-11 items-center text-sm md:text-2xl
                  cursor-pointer transition-all duration-300 ease-in-out ${
                    activeTab.name === card.name ? "border-2 border-white" : "border-2 border-transparent"
                  }`}
                onClick={() => setActiveTab(card)}
              >
                <p className="text-center">{card.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 md:p-8">
        <h2 className="text-2xl font-bold mb-4 uppercase md:text-4xl">
          {activeTab.title || activeTab.name || "Unknown Service"}
        </h2>
        {activeTab.component ? (
          <div className="text-lg">{activeTab.component}</div>
        ) : (
          <p className="text-lg">Sorry, this service is not currently available</p>
        )}
      </div>
    </>
  );
}

export default SecuritySystemsPage;

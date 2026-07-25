'use client';

import Image from "next/image";
import bannerImage from "@/assets/images/securitySystemsBannerImage.png";
import CCTVSurveillance from "./CCTVSurveillance";
import GPSTracking from "./GPSTracking";
import BiometricAndAutomatedGate from "./BiometricAndAutomatedGate";
import CyberSecurity from "./CyberSecurity";
import MobileTracking from "./MobileTracking";
import HardwareProcurementAndSupply from "./HardwareProcurementAndSupply";

import { useState } from "react";

const cards = [
  {
    name: "CCTV Surveillance",
    title: "CCTV Surveillance Camera Installation",
    component: <CCTVSurveillance />
  },
  {
    name: "GPS Tracking",
    title: "GPS Tracking Solutions",
    component: <GPSTracking />
  },
  {
    name: "Biometric & Automated Gates",
    title: "Biometric & Automated Gate Systems",
    component: <BiometricAndAutomatedGate />
  },
  {
    name: "Cyber Security",
    title: "Cyber Security Solutions",
    component: <CyberSecurity />
  },
  {
    name: "Mobile Tracking",
    title: "Mobile Tracking Solutions",
    component: <MobileTracking />
  },
  {
    name: "Hardware Procurement & Supplying",
    title: "Hardware Procurement & Supplying",
    component: <HardwareProcurementAndSupply />
  }
];

function SecuritySystemsPage() {

  const [activeTab, setActiveTab] = useState(cards[0]);

  return (
  <>
    <div className="relative overflow-x-hidden">
      <Image
        src={bannerImage}
        alt="Banner Image"
        className="w-screen h-auto -z-10"
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
          className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black outline-none focus:border-[#2f59c1] focus:ring-2 focus:ring-blue-200"
        >
          {cards.map((card) => (
            <option key={card.name} value={card.name}>
              {card.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden px-4 py-4 items-center justify-center md:flex md:absolute md:top-[27.5vh] md:w-screen md:px-0 md:py-0">
        <div className="grid grid-cols-2 gap-3 w-full md:grid-cols-3 md:gap-6 md:w-auto">
          {
            cards.map((card, index) => (
              <div
                key={index}
                className={`text-white rounded-2xl bg-[#2f59c1] md:bg-white/15 md:backdrop-blur-md
                  min-h-20 p-3 md:p-0 md:min-w-[22vw] md:min-h-[12vw] md:max-w-77.5 md:max-h-35
                  flex justify-center items-center text-sm md:text-2xl
                  cursor-pointer transition-all duration-300 ease-in-out `
                + (
                  activeTab.name === card.name ? "border-2 border-white" : "border-2 border-transparent"
                )
              }
                onClick={() => setActiveTab(card)}
              >
                <p className="text-center">{card.name}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-4 uppercase md:text-4xl">{activeTab.title || activeTab.name || "Unknown Service"}</h2>
      {
        activeTab.component
        ? <div className="text-lg">{activeTab.component}</div>
        : <p className="text-lg">Sorry, this service is not currently available (┬┬﹏┬┬)</p>
      }
    </div>
  </>
  )
}

export default SecuritySystemsPage

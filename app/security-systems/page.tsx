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
      <div className="absolute top-[27.5vh] w-screen flex items-center justify-center">
        <div className="grid grid-cols-3 gap-6">
          {
            cards.map((card, index) => (
              <div 
                key={index} 
                className={`text-white rounded-2xl bg-white/15 backdrop-blur-md 
                  min-w-[22vw] min-h-[12vw] max-w-77.5 max-h-35 
                  flex justify-center items-center text-2xl 
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
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-4 uppercase">{activeTab.title || activeTab.name || "Unknown Service"}</h2>
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

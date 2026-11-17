"use client";

import { useEffect, useState } from "react";

import CCTVSurveillance from "./CCTVSurveillance";
import GPSTracking from "./GPSTracking";
import BiometricAndAutomatedGate from "./BiometricAndAutomatedGate";
import CyberSecurity from "./CyberSecurity";
import MobileTracking from "./MobileTracking";
import HardwareProcurementAndSupply from "./HardwareProcurementAndSupply";

const cards = [
  {
    hash: "cctv",
    name: "CCTV Surveillance",
    title: "CCTV Surveillance Camera Installation",
    component: <CCTVSurveillance />,
  },
  {
    hash: "gps",
    name: "GPS Tracking",
    title: "GPS Tracking Solutions",
    component: <GPSTracking />,
  },
  {
    hash: "biometric",
    name: "Biometric & Automated Gates",
    title: "Biometric & Automated Gate Systems",
    component: <BiometricAndAutomatedGate />,
  },
  {
    hash: "cyber",
    name: "Cyber Security",
    title: "Cyber Security Solutions",
    component: <CyberSecurity />,
  },
  {
    hash: "mobile",
    name: "Mobile Tracking",
    title: "Mobile Tracking Solutions",
    component: <MobileTracking />,
  },
  {
    hash: "hardware",
    name: "Hardware Procurement & Supplying",
    title: "Hardware Procurement & Supplying",
    component: <HardwareProcurementAndSupply />,
  },
];

interface SecurityCard {
  hash: string;
  name: string;
  title: string;
  component: React.ReactNode;
}

function SecuritySystemsPage() {
  const [activeTab, setActiveTab] = useState<SecurityCard>(cards[0]);
  const [activeTabHash, setActiveTabHash] = useState(cards[0].hash);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const match = cards.find((c) => c.hash === hash);
      if (match) {
        setActiveTab(match);
        setActiveTabHash(match.hash);
      }
    };

    onHashChange();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleSelectTab = (card: SecurityCard) => {
    setActiveTab(card);
    setActiveTabHash(card.hash);
    window.history.replaceState(null, "", `#${card.hash}`);
    document.getElementById("security-content")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="overflow-x-hidden bg-[#F6F4F0]">
      <section className="studio-hero">
        <div className="section-shell">
          <div className="max-w-2xl">
            <span className="eyebrow">Enterprise security</span>
            <h1 className="section-title mt-5">Security systems and solutions</h1>
            <p className="section-lead mt-5 max-w-xl">
              People, property, and data, looked after with surveillance, tracking, and cyber security.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow">Choose a service</span>
            <h2 className="section-title mt-4 text-3xl sm:text-4xl">
              Security offerings
            </h2>
          </div>

          <div className="mb-10 flex flex-wrap gap-x-6 gap-y-3 border-b border-[#E3DDD4]">
            {cards.map((card) => {
              const isActive = activeTabHash === card.hash;
              return (
                <button
                  key={card.hash}
                  onClick={() => handleSelectTab(card)}
                  className={`-mb-px border-b pb-3 text-sm transition-colors ${
                    isActive
                      ? "border-[#1E5AC8] font-medium text-[#141413]"
                      : "border-transparent text-[#6B6560] hover:text-[#141413]"
                  }`}
                >
                  {card.name}
                </button>
              );
            })}
          </div>

          <div id="security-content" className="scroll-mt-28 border border-[#E3DDD4] bg-white p-6 md:p-10">
            <h2 className="mb-6 font-display text-3xl font-medium leading-tight text-[#141413] md:text-4xl">
              {activeTab.title || activeTab.name || "Unknown Service"}
            </h2>
            {activeTab.component ? (
              <div className="text-lg">{activeTab.component}</div>
            ) : (
              <p className="text-lg text-slate-600">Sorry, this service is not currently available</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default SecuritySystemsPage;
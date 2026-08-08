"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
    <div className="overflow-x-hidden bg-white">
      <section className="relative overflow-hidden bg-slate-950 pt-28 pb-16 text-white md:pb-20">
        <Image
          src="/images/images/securitySystemsBannerImage.png"
          alt="Security Systems"
          fill
          priority
          className="absolute inset-0 object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-brand-600/40 blur-[120px]" />

        <div className="section-shell relative">
          <div className="max-w-2xl">
            <span className="pill">Enterprise Security</span>
            <h1 className="font-display mt-5 text-4xl font-semibold uppercase leading-[1.1] text-white sm:text-5xl">
              SECURITY SYSTEMS &amp; SOLUTIONS
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              Protecting your people, property, and data with enterprise-grade
              surveillance, tracking, and cyber security services.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col items-center">
            <span className="section-tag justify-center">Choose a Service</span>
            <h2 className="section-title mt-4 text-3xl text-balance sm:text-4xl">
              Explore our security offerings
            </h2>
          </div>

          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            {cards.map((card) => {
              const isActive = activeTabHash === card.hash;
              return (
                <button
                  key={card.hash}
                  onClick={() => handleSelectTab(card)}
                  className={`rounded-none px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-slate-950 text-white shadow-soft"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-brand-600 hover:text-brand-600"
                  }`}
                >
                  {card.name}
                </button>
              );
            })}
          </div>

          <div id="security-content" className="scroll-mt-24 rounded-none border border-slate-100 bg-white p-6 shadow-soft md:p-10">
            <h2 className="mb-6 font-display text-3xl font-semibold uppercase leading-tight text-slate-900 md:text-4xl">
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
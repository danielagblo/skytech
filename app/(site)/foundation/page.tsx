"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Initiative {
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
}

interface DonationTier {
  amount: number;
  label: string;
  impact: string;
  description: string;
}

const initiatives: Initiative[] = [
  {
    title: "Orphanage IT Training",
    tagline: "Unlocking careers for foster youth",
    description: "We deliver structured software development, design, and hardware literacy bootcamps to kids in foster care. By partnering directly with local orphanages, we give these students the specialized training they need to enter the digital economy.",
    benefits: [
      "Dedicated weekly training sessions",
      "Hands-on coding & hardware labs",
      "One-on-one professional mentorship"
    ],
    icon: (
      <svg className="h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    title: "Tech Bootcamps for Underserved Youth",
    tagline: "Empowering local communities",
    description: "We host free community workshops covering modern web technologies, programming fundamentals, and essential digital toolkits. Our bootcamps target youth who lack access to premium tech education.",
    benefits: [
      "Free access to study resources",
      "Practical project-based curriculum",
      "Certificates of completion"
    ],
    icon: (
      <svg className="h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  },
  {
    title: "Rural School Computer Labs",
    tagline: "Expanding technological horizons",
    description: "No student should learn computer science from a blackboard. We coordinate hardware donations, refurbish devices, and install computing infrastructure in rural schools, opening up a world of online resources.",
    benefits: [
      "Lab setups in remote public schools",
      "Refurbished laptops & software installations",
      "Basic tech support & teacher training"
    ],
    icon: (
      <svg className="h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "Internship Placements & Careers",
    tagline: "Connecting learning with livelihood",
    description: "The journey doesn't end with training. We bridge the gap between classroom and workplace by transitioning high-performing graduates into internships and junior roles at Skytech and partner tech firms.",
    benefits: [
      "Direct pipeline to local tech roles",
      "Real-world project experience",
      "Resume building & career counseling"
    ],
    icon: (
      <svg className="h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
];

const donationTiers: DonationTier[] = [
  {
    amount: 15,
    label: "Study Kit",
    impact: "Provides offline reading material and learning guides for a student.",
    description: "Equip one orphanage trainee with the critical books, printouts, and digital learning guides needed to reference material without internet access."
  },
  {
    amount: 40,
    label: "Lab Connectivity",
    impact: "Sponsors reliable internet access for one class for an entire month.",
    description: "Keeps our training room or a rural classroom connected online so students can download libraries, use documentation, and push code to GitHub."
  },
  {
    amount: 120,
    label: "Student Laptop",
    impact: "Funds a refurbished laptop for a dedicated orphanage trainee.",
    description: "Gives a young developer their own workstation to code on during the program and keep afterwards, enabling them to build a freelance career."
  },
  {
    amount: 250,
    label: "Bootcamp Champion",
    impact: "Covers teaching resources, workspace utilities, and mentorship support.",
    description: "Directly funds the operational cost of one student going through the complete 6-month intensive training program and placement cycle."
  }
];

export default function FoundationPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<DonationTier>(donationTiers[1]);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isDonating, setIsDonating] = useState<boolean>(false);
  const [donationSuccess, setDonationSuccess] = useState<boolean>(false);

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDonating(true);

    // Simulate payment processing flow
    setTimeout(() => {
      setIsDonating(false);
      setDonationSuccess(true);
    }, 1500);
  };

  const currentDonationAmount = customAmount ? parseFloat(customAmount) : selectedTier.amount;

  return (
    <div className="overflow-x-hidden bg-white text-slate-800">
      {/* ===== Hero Section ===== */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-slate-950 pt-28 pb-20">
        <Image
          src="/images/images/AboutBanner.png"
          alt="Skytech Foundation Hero"
          fill
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-grid opacity-20" />
        <div className="pointer-events-none absolute -top-32 right-0 h-[34rem] w-[34rem] rounded-full bg-brand-600/40 blur-[120px]" />

        <div className="section-shell relative z-10 w-full max-w-4xl text-center">
          <span className="inline-flex items-center rounded-none bg-brand-500 px-5 py-2 text-sm font-bold uppercase tracking-[0.2em] text-white mb-6">Skytech Foundation</span>
          <h1 className="font-display text-4xl font-bold uppercase leading-none tracking-tight text-white sm:text-5xl lg:text-6xl mt-4">
            Bridging the Digital Divide
            <span className="block text-brand-300">Through Real Action</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-200">
            We believe that high-quality technology education is the ultimate equalizer. Through structured IT labs, vocational coding bootcamps, and career placement, we empower local youth and foster kids to build secure digital futures.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="#initiatives" className="btn-secondary !border-white/25 !bg-white/10 !text-white backdrop-blur-sm hover:!bg-white/20 !text-sm">
              OUR PROGRAMS
            </a>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setDonationSuccess(false);
                setCustomAmount("");
              }}
              className="btn-primary !text-sm bg-brand-500 hover:bg-brand-600"
            >
              DONATE NOW
            </button>
          </div>
        </div>
      </section>

      {/* ===== Overview Intro ===== */}
      <section className="py-20 bg-slate-50" id="overview">
        <div className="section-shell grid grid-cols-1 gap-12 items-center md:grid-cols-2">
          <div className="space-y-6">
            <span className="section-tag">Who We Are</span>
            <h2 className="section-title text-3xl sm:text-4xl">Creating sustainable pathways to technology careers</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              At Skytech, our core competency is building advanced digital systems. Through the Skytech Foundation, we take that same professional excellence and deploy it to uplift communities. We don't just supply laptops; we teach curriculum, foster mentorship, and offer direct internship positions.
            </p>
            <p className="text-slate-600">
              Our flagship program focuses heavily on orphans, providing structured, long-term training that leads directly to vocational stability. Alongside this, we coordinate rural school infrastructure setups and community workshops to build broad-based technological literacy.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-[28rem] md:max-w-none">
            <div className="relative aspect-video w-full overflow-hidden rounded-none shadow-lift ring-1 ring-brand-100 bg-slate-900">
              <Image
                src="/images/images/educationtechImage.png"
                alt="Impactful Education"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Initiatives (The Pillars) ===== */}
      <section className="py-24 bg-white" id="initiatives">
        <div className="section-shell space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="section-tag">Key Initiatives</span>
            <h2 className="section-title text-3xl sm:text-4xl">Our Core Impact Programs</h2>
            <p className="text-slate-600">
              We focus our efforts on sustainable, verified activities that deliver concrete skills to those who need them most.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {initiatives.map((init) => (
              <div
                key={init.title}
                className="flex flex-col justify-between p-8 border border-slate-100 bg-white hover:border-brand-200 transition-all duration-300 group hover:shadow-soft"
              >
                <div className="space-y-4">
                  <div className="p-3 w-fit bg-brand-50 rounded-none group-hover:bg-brand-100 transition-colors">
                    {init.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900">{init.title}</h3>
                  <p className="text-sm font-semibold text-brand-600 tracking-wide uppercase">{init.tagline}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{init.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Donation Modal Overlay ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 text-white rounded-none shadow-lift overflow-hidden flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Column: Context / Details */}
            <div className="p-8 md:w-1/2 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />
              <div className="relative z-10 space-y-6">
                <span className="pill bg-white/10 text-brand-300 border-white/15">Sponsor a Trainee</span>
                <h3 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">
                  Help Us Empower More Students
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  By donating, you directly sponsor hardware procurement, internet access, and educational guides for youth who are eager to build software and hardware skills.
                </p>

                <div className="space-y-4 bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
                  <p className="text-xs font-semibold tracking-wider uppercase text-brand-300">Your Current Impact Selection</p>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-bold text-white">{selectedTier.label}</h4>
                    <span className="text-xl font-black text-brand-300">${currentDonationAmount}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/10">
                    {selectedTier.impact}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    {selectedTier.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Interaction Form */}
            <div className="p-8 md:w-1/2 bg-white text-slate-900 flex flex-col justify-center">
              {donationSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900">Thank You!</h3>
                  <p className="text-slate-600 text-sm max-w-xs mx-auto">
                    Your donation of <span className="font-semibold text-slate-900">${currentDonationAmount}</span> has been processed successfully. You've helped unlock a student's digital future.
                  </p>
                  <button
                    onClick={() => {
                      setDonationSuccess(false);
                      setCustomAmount("");
                    }}
                    className="btn-secondary !text-xs !py-2 !px-4 mt-6 inline-flex"
                  >
                    Donate Again
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDonateSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                      Select Donation Amount (USD)
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {donationTiers.map((tier) => (
                        <button
                          key={tier.amount}
                          type="button"
                          onClick={() => {
                            setSelectedTier(tier);
                            setCustomAmount("");
                          }}
                          className={`py-2 px-3 text-sm text-center font-bold transition-all border ${
                            selectedTier.amount === tier.amount && !customAmount
                              ? "bg-brand-600 text-white border-brand-600"
                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                          }`}
                        >
                          ${tier.amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="custom-amount" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Or Enter Custom Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                      <input
                        id="custom-amount"
                        type="number"
                        min="5"
                        placeholder="Other Amount"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedTier({
                            amount: e.target.value ? parseFloat(e.target.value) : 15,
                            label: "Custom Donation",
                            impact: "Directly funds critical learning materials and trainer stipends.",
                            description: "Your custom contribution helps fill emergency supply gaps, internet bandwidth expansions, or classroom utilities."
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 py-2.5 pl-8 pr-4 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isDonating || (customAmount !== "" && parseFloat(customAmount) <= 0)}
                    className="w-full btn-primary bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDonating ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      `Donate $${currentDonationAmount}`
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useState } from "react";
import PDFViewer from "../../../components/PDFViewer";
import Link from "next/link";

export default function PricingPage() {
  const [activeCategory, setActiveCategory] = useState("web");

  const categories = [
    { id: "web", label: "Web Development" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "marketing", label: "SEO & Growth" },
    { id: "branding", label: "Creative Identity" },
  ];

  const currentPackages = pricingData[activeCategory] || [];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section (The Investment Manifesto) */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-32 pb-24 px-4 border-b border-white/5">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute -left-10 top-0 h-[500px] w-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-[500px] w-[500px] bg-cyan-400/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
        </div>
        
        <div className="section-shell relative space-y-10">
          <span className="pill border-blue-600/20 text-blue-400 bg-blue-600/10 uppercase tracking-[0.2em] text-[10px] font-black">Investment Guide</span>
          <div className="max-w-4xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
              Transparent Pricing. <br />
              <span className="text-blue-600 font-black">Zero Surprises.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-2xl">
              From startups to global enterprises, we provide fixed-price engineering solutions designed for long-term scalability.
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="bg-slate-50 border-b border-slate-100 sticky top-[72px] z-30">
        <div className="section-shell">
          <div className="flex overflow-x-auto no-scrollbar gap-2 py-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "bg-white text-slate-400 hover:text-slate-600 border border-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <section className="py-24 bg-white">
        <div className="section-shell space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPackages.map((pkg, idx) => (
              <div 
                key={pkg.name} 
                className={`group relative p-8 rounded-[2rem] border transition-all duration-500 flex flex-col ${
                  pkg.featured 
                    ? "bg-slate-950 text-white border-blue-600/30 shadow-2xl shadow-blue-600/10 scale-105 z-10" 
                    : "bg-white border-slate-100 hover:border-blue-600/20 hover:shadow-2xl"
                }`}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-blue-600/40">
                    Recommended Architecture
                  </div>
                )}
                
                <div className="space-y-2 mb-8">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${pkg.featured ? "text-blue-400" : "text-blue-600"}`}>
                    {pkg.tier} Tier
                  </span>
                  <h3 className="text-xl font-black tracking-tight leading-tight h-12 flex items-center">
                    {pkg.name}
                  </h3>
                  <div className="pt-4 flex items-baseline gap-1">
                    <span className={`text-xs font-bold ${pkg.featured ? "text-blue-400/50" : "text-slate-400"}`}>GHS</span>
                    <span className="text-3xl font-black tracking-tighter">{pkg.price}</span>
                    {pkg.interval && <span className="text-xs font-medium opacity-60">/{pkg.interval}</span>}
                  </div>
                </div>

                <div className="space-y-6 flex-grow">
                   <p className={`text-[10px] font-black uppercase tracking-widest ${pkg.featured ? "text-slate-400" : "text-slate-500"}`}>Technical Deliverables</p>
                   <ul className="space-y-3">
                      {pkg.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-xs font-medium">
                          <svg className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${pkg.featured ? "text-blue-400" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className={pkg.featured ? "text-slate-300" : "text-slate-600"}>{item}</span>
                        </li>
                      ))}
                   </ul>
                </div>

                <div className="mt-8">
                  <Link 
                    href="/site/contact" 
                    className={`w-full inline-flex justify-center items-center px-6 py-4 rounded-xl font-black text-xs transition-all ${
                      pkg.featured 
                        ? "bg-blue-600 text-white hover:bg-white hover:text-slate-900" 
                        : "bg-slate-900 text-white hover:bg-blue-600"
                    }`}
                  >
                    Initiate Project
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Expert Resource (The Prospectus) */}
          <div className="rounded-[3rem] border border-slate-100 bg-slate-50 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4 text-center md:text-left">
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em]">Technical Deep-Dive</span>
              <h2 className="text-3xl font-black text-slate-900">Download the Full Prospectus.</h2>
              <p className="text-slate-500 max-w-xl leading-relaxed">
                Need a granular breakdown of our methodologies, security protocols, and long-term support plans? Access our latest pricing and strategy guide.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-6">
              <PDFViewer src="/static/pricing.pdf" label="Open Detailed Strategy Guide" />
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                Secure PDF • 19.3 MB • Updated May 2024
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Values */}
      <section className="py-24 bg-white border-t border-slate-50">
        <div className="section-shell">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Transparent Line-Items", desc: "No hidden costs. Every quote includes engineering, QA, and initial infrastructure deployment." },
              { title: "ROI-Centric Pricing", desc: "We price based on the technical complexity and the measurable business impact of the solution." },
              { title: "Architectural Scalability", desc: "Our models are designed to grow. Scale your investment as your product moves from MVP to Enterprise." }
            ].map(item => (
              <div key={item.title} className="space-y-4">
                <div className="h-1 w-12 bg-blue-600" />
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const pricingData = {
  web: [
    {
      name: "Basic Website Package",
      tier: "Startup",
      price: "2,500",
      highlights: [
        "5-6 Page Responsive Site",
        "Basic SEO Optimization",
        "WhatsApp Integration",
        "1 Business Email Account",
        "12 Months Free Hosting & SSL",
        "6 Months Technical Support"
      ]
    },
    {
      name: "Standard Business Package",
      tier: "Growth",
      price: "6,500",
      featured: true,
      highlights: [
        "10-12 High-Performance Pages",
        "Advanced SEO Engine",
        "Custom Contact Forms",
        "CMS/Blog Integration",
        "Google Business Profile Optimization",
        "Analytics Dashboard Access"
      ]
    },
    {
      name: "E-commerce/Booking Package",
      tier: "Retail",
      price: "25,000",
      highlights: [
        "Full Online Store / Booking Hub",
        "Payment Gateway (Visa/Momo)",
        "Automated Stock Management",
        "Abandoned Cart Recovery",
        "5 Premium Business Emails",
        "Advanced Schema Optimization"
      ]
    },
    {
      name: "Premium Corporate Package",
      tier: "Enterprise",
      price: "45,000",
      highlights: [
        "Unlimited System Pages",
        "Custom API/CRM Integrations",
        "Global SEO & Multilingual Support",
        "10 Premium Business Emails",
        "Dedicated Account Manager",
        "Lifetime Security Updates"
      ]
    }
  ],
  mobile: [
    {
      name: "Business Growth App",
      tier: "Standard",
      price: "24,000",
      highlights: [
        "Android & iOS (8-12 Screens)",
        "Integrated Payment Gateway",
        "Real-time Push Notifications",
        "Centralized Admin Panel",
        "App Store Optimization (ASO)"
      ]
    },
    {
      name: "Enterprise App Suite",
      tier: "Advanced",
      price: "80,000",
      featured: true,
      highlights: [
        "Full-Stack Dev (up to 25 Screens)",
        "Real-time Data Synchronization",
        "AWS/GCP Scalable Infrastructure",
        "Biometric/2FA Security",
        "6 Months Intensive Maintenance"
      ]
    },
    {
      name: "Marketplace & Fintech",
      tier: "Elite",
      price: "120,000",
      highlights: [
        "Multi-Vendor Ecosystem Architecture",
        "In-App Digital Wallets",
        "Live GPS Logistics Tracking",
        "Bank-Grade Data Encryption",
        "Vendor Management Portal",
        "24/7 Premium Support Line"
      ]
    }
  ],
  marketing: [
    {
      name: "Silver SEO Plan",
      tier: "Essential",
      price: "1,500",
      interval: "mo",
      highlights: [
        "Comprehensive Keyword Research",
        "On-Page Technical SEO",
        "Monthly Performance Reports",
        "Local Search Optimization",
        "Meta Data Hardening"
      ]
    },
    {
      name: "Gold SEO Plan",
      tier: "Professional",
      price: "3,500",
      interval: "mo",
      featured: true,
      highlights: [
        "In-depth Competitor Analysis",
        "High-Authority Backlink Building",
        "Content Marketing Strategy",
        "Bi-Weekly Strategy Reviews",
        "Conversion Rate Optimization"
      ]
    },
    {
      name: "Platinum SEO Plan",
      tier: "Dominance",
      price: "7,500",
      interval: "mo",
      highlights: [
        "Full Digital Presence Management",
        "4 Authority Blog Posts / Month",
        "Complete Technical SEO Audits",
        "Weekly Dedicated Strategy Calls",
        "Omni-channel Growth Consulting"
      ]
    }
  ],
  branding: [
    {
      name: "Starter Branding",
      tier: "Identity",
      price: "1,200",
      highlights: [
        "Custom Logo (2 Design Concepts)",
        "Professional Business Cards",
        "Social Media Profile Assets",
        "Basic Color Palette",
        "Typography Selection"
      ]
    },
    {
      name: "Business Identity",
      tier: "Corporate",
      price: "3,500",
      featured: true,
      highlights: [
        "Custom Logo (4 Design Concepts)",
        "Comprehensive Brand Guidelines",
        "10 Custom Social Media Templates",
        "Full Company Profile Design",
        "Stationery System Design"
      ]
    },
    {
      name: "Master Enterprise",
      tier: "Elite",
      price: "8,000",
      highlights: [
        "Custom UI/UX Design System",
        "Professional Logo Animation",
        "Full Marketing Collateral Suite",
        "Brand Voice & Messaging Guide",
        "High-Res Source Deliverables"
      ]
    }
  ]
};

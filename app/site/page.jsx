import React from "react";
export const dynamic = 'force-dynamic';
import Link from "next/link";
import Image from "next/image";
import { getHeroData } from '../lib/hero';
import { getSettings, DEFAULT_SETTINGS } from '../lib/settings';
import { getAffiliates } from '../lib/affiliates';
import { getTestimonials } from '../lib/testimonials';
import { getPricing } from '../lib/pricing';
import { getBlogPosts } from '../admin/blog-actions';
import { getProjects } from '../lib/projects';
import { getFAQs } from '../lib/faqs';

import FreeAuditForm from "../../components/FreeAuditForm";
import HeroSlideshow from "../../components/HeroSlideshow";
import AnimatedStats from "../../components/AnimatedStats";
import WhyChooseUsSection from "../../components/WhyChooseUsSection";

export const metadata = {
  title: "Skytech Ghana - Website & Mobile App Developers",
  description:
    "Skytech Ghana builds websites and mobile apps for businesses. Simple, clear, and focused on results.",
};

const stats = [
  { label: "10 years on the Ghanaian market", value: "10+" },
  { label: "Satisfied customers", value: "100+" },
  { label: "Unique projects and still counting", value: "150+" },
  { label: "Continental experience", value: "03+" },
];




const websitePackages = [
  {
    name: "Basic Website Package",
    tagline: "Best for Startups & Small Businesses",
    timeline: "3–8 weeks",
    price: "GHS 2,500",
    highlights: [
      "5–6 page modern responsive website",
      "Homepage, About, Services, Contact",
      "Basic SEO setup",
      "WhatsApp chat integration",
      "1 business email (info@yourbusiness.com)",
      "Google Maps & social media links",
      "Mobile optimization",
      "Free SSL certificate",
      "6 months support",
      "Free speed optimization (Bonus)",
      "Free hosting for 12 months (Bonus)",
    ],
  },
  {
    name: "Standard Business Package",
    tagline: "Most Popular – For Growing Brands",
    timeline: "2–3 months",
    price: "GHS 6,500",
    highlights: [
      "Includes everything in Basic plus:",
      "10–12 pages",
      "Advanced SEO (keywords, ranking, indexing)",
      "Custom contact forms + automated emails",
      "Live chat system",
      "Testimonials, portfolio, gallery",
      "Blog with admin access (CMS)",
      "Analytics dashboard",
      "3 business emails",
      "Security hardening",
      "Google Business Profile (Bonus)",
    ],
    badge: "Most popular",
  },
  {
    name: "E-commerce/Booking Package",
    tagline: "For Retail, Restaurants, & Services",
    timeline: "3–6 months",
    price: "GHS 25,000",
    highlights: [
      "Includes everything in Standard plus:",
      "Full online store or booking system",
      "Product uploads (up to 50 items)",
      "Payment integrations (Visa, Momo, Paystack)",
      "Stock & coupon management",
      "Cart abandonment recovery",
      "Automated order emails",
      "Secure admin dashboard",
      "Advanced SEO + schema",
      "5 business emails",
      "Analytics setup (Google Analytics + Search Console) (Bonus)",
    ],
  },
  {
    name: "Premium Corporate Package",
    tagline: "For companies that need a full digital system",
    timeline: "4–6 months",
    price: "GHS 45,000",
    highlights: [
      "Custom UI/UX design",
      "Full CMS or web application",
      "Employee portal / client portal",
      "API integrations",
      "Mobile app–feel interface",
      "Enterprise SEO",
      "Security firewall + monitoring",
      "Priority support",
      "Brand kit creation (Bonus)",
      "Does not include hosting",
    ],
  },
];

const seoGrowthPlan = {
  name: "Professional SEO Growth Plan",
  priceRange: "GHS 600/month – GHS 2,000/month",
  items: [
    "Keyword ranking & mapping",
    "High-authority backlink building",
    "Regular blog content creation",
    "Monthly technical SEO audits",
    "Performance & ranking reports",
  ],
};

const appPackages = [
  {
    name: "Starter App Package",
    tagline: "Best for personal brands & small teams",
    timeline: "2–3 weeks",
    price: "GHS 12,000",
    highlights: [
      "Cross-platform app (Android + iOS)",
      "5 main screens (Home, Services, Contact)",
      "Basic UI/UX design",
      "Simple dashboard",
      "1 API integration",
      "Push notifications (basic)",
      "1-month free support",
    ],
  },
  {
    name: "Business Growth Package",
    tagline: "Best for SMEs & E-commerce",
    timeline: "4–6 weeks",
    price: "GHS 24,000",
    highlights: [
      "8–12 screens (custom UI/UX)",
      "User authentication (Email/Phone)",
      "Payment gateway integration",
      "Booking system / E-commerce",
      "Analytics integration (Firebase)",
      "Admin panel",
      "Push notifications",
      "2 months support",
      "SEO-Optimized app listing (Bonus)",
    ],
    badge: "Most popular",
  },
  {
    name: "Enterprise App Package",
    tagline: "Best for large companies & finance",
    timeline: "2–3 months",
    price: "GHS 80,000",
    highlights: [
      "Up to 25 screens (premium UI/UX)",
      "Advanced auth (OTP, 2FA, Social)",
      "Full e-commerce/marketplace system",
      "Wallet / Subscription system",
      "Real-time chat",
      "Advanced admin + analytics",
      "API development",
      "Play Store/App Store optimization (Bonus)",
      "3 months support",
    ],
  },
  {
    name: "Advanced Marketplace & Fintech",
    tagline: "For complex Uber-like or Wallet apps",
    timeline: "3–6 months",
    price: "GHS 120,000",
    highlights: [
      "Apps + Web Admin + Vendor Portal",
      "Real-time location tracking",
      "In-app wallet & payment orchestration",
      "Multi-vendor system",
      "Bank-grade encryption",
      "Cloud infrastructure setup",
      "6 months premium support",
      "Free initial consulting (Bonus)",
    ],
  },
];

const features = [
  {
    icon: "⚡",
    title: "Fast and clear",
    description:
      "We move fast and keep you updated, so you always know what is happening.",
  },
  {
    icon: "🤝",
    title: "We work with you",
    description:
      "We listen, ask questions, and build what your customers need.",
  },
  {
    icon: "📈",
    title: "Real results",
    description:
      "We build things that help your business grow.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "We listen",
    description:
      "You tell us your goals. We ask questions and agree on the plan.",
  },
  {
    number: "02",
    title: "We build",
    description:
      "We design and build while keeping you updated each week.",
  },
  {
    number: "03",
    title: "We launch and support",
    description:
      "We launch, fix issues fast, and help you grow.",
  },
];

// Database fetching functions removed to resolve connection errors.
// All data is now hardcoded for high-performance stability.

const hardcodedServices = [
  {
    _id: "1",
    title: "Web Engineering",
    description: "High-performance, secure, and scalable web architectures designed for global reach.",
    icon: "Globe"
  },
  {
    _id: "2",
    title: "Mobile App Development",
    description: "iOS and Android experiences that feel native, fast, and feature-rich.",
    icon: "Smartphone"
  },
  {
    _id: "3",
    title: "SEO & Digital Growth",
    description: "Technical SEO and data-driven marketing to dominate search rankings.",
    icon: "TrendingUp"
  },
  {
    _id: "4",
    title: "Creative Identity & Branding",
    description: "Bespoke visual systems and brand architectures that command institutional authority.",
    icon: "Palette"
  }
];



export default async function Home() {
  const heroData = await getHeroData();
  const pricingData = await getPricing();
  const webPricing = pricingData.find(c => c.category === 'web') || { packages: [] };
  const pricing = webPricing.packages.slice(0, 3); // Get first 3 packages
  const homeContent = {
    servicesSectionTitle: "Engineering the digital products of tomorrow.",
    servicesSubtitle: "From high-performance architecture to forensic product optimization, we build systems that scale.",
    ctaTitle: "Engineering excellence delivered with precision.",
    ctaSubtitle: "Tell us about your project. We'll provide a clear roadmap and the technical power to bring it to life."
  };

  const testimonialsData = await getTestimonials();
  const testimonials = testimonialsData.length > 0 ? testimonialsData : [];


  const settings = await getSettings();
  const services = hardcodedServices;
  const pricingBookletUrl = settings.pricingBookletUrl || "/static/pricing.pdf";


  const allPosts = await getBlogPosts();
  const latestPosts = allPosts.filter(p => p.published).slice(0, 3);

  const projects = await getProjects();
  const galleryProjects = projects.slice(0, 3);

  const faqs = await getFAQs();
  const faqsPreview = faqs.slice(0, 5);

  const hero = {
    title: "World Class Software solutions for all businesses.",
    subtitle: "No 1# website development company in Ghana.",
    imageUrl: heroData?.imageUrl || "/images/hero-3.png"
  };

  const partnersData = await getAffiliates();
  const allPartners = (partnersData || []).filter((p) => p?.logoUrl || p?.name);

  return (
    <>
      {/* Hero Section (Total Asset Clarity - No Overlay) */}
      <section className="relative overflow-hidden bg-white text-slate-900 min-h-screen flex items-center">
        {/* Singular Background Asset - Full Clarity */}
        <div className="absolute inset-0 z-0">
          <Image
            src={hero.imageUrl}
            alt="Skytech Tech Infrastructure"
            fill
            className="object-cover opacity-100 transition-transform duration-[20s] scale-110 hover:scale-100"
            priority
          />
          {/* Dark Overlay - Left Aligned Gradient */}
          <div className="absolute inset-0 bg-slate-900/40 z-0 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent z-0 pointer-events-none" />
        </div>

        <div className="relative z-10 pt-20 pl-4 sm:pl-8 lg:pl-16 w-full">
          <div className="flex items-center justify-start min-h-[70vh]">
            <div className="max-w-6xl space-y-12 text-left flex flex-col items-start">
              <div className="space-y-8">
                <h1 className="text-4xl lg:text-6xl leading-[1.1] tracking-tight text-white font-light">
                  World Class <br />
                  <span className="font-extrabold text-white">Software solutions</span> <br />
                  for all <span className="font-extrabold text-blue-400">businesses.</span>
                </h1>

                {/* Unified Tag Unit */}
                <div className="inline-flex flex-col items-start rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10 w-full">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">
                      No 1# website development company in Ghana.
                    </span>
                  </div>
                  <div className="px-5 py-3">
                    <p className="text-sm sm:text-base text-white font-bold tracking-tight">
                      Get a website that ranks No. 1 on Google.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-start gap-6 pt-4">
                <Link
                  className="btn-primary px-10 py-5 text-base font-bold rounded-full shadow-2xl shadow-blue-600/20 active:scale-95 transition-all"
                  href="/site/contact"
                >
                  Start Your Project
                </Link>
                <Link
                  className="btn-secondary bg-white text-blue-600 border-none hover:bg-slate-50 px-10 py-5 text-base font-bold rounded-full shadow-lg transition-all active:scale-95"
                  href="/site/pricing"
                >
                  View Rate Card
                </Link>
              </div>
            </div>
          </div>

          {/* Bouncing Scroll Arrow - Centered at Bottom */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
            <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/40 to-white/0" />
            <div className="animate-bounce">
              <svg className="w-6 h-6 text-white opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Network (Dynamic Marquee) */}
      {allPartners.length > 0 && (
        <section className="relative bg-white py-12 border-b border-slate-100 overflow-hidden">
          {/* Corner Badge */}
          <div className="absolute top-0 left-0 bg-blue-600 text-white px-5 py-2 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-lg z-10 rounded-br-lg">
            Affiliate Network
          </div>

          <div className="relative flex items-center">
            {/* Marquee Container */}
            <div className="flex w-full overflow-hidden">
              <div className="flex animate-marquee items-center gap-16 whitespace-nowrap py-4">
                {[...Array(3)].map((_, i) => (
                  <React.Fragment key={i}>
                    {allPartners.map((partner, idx) => (
                      <div key={`${i}-${idx}`} className="flex-shrink-0">
                        <Image
                          src={partner.logoUrl}
                          alt={partner.name || "Partner Logo"}
                          width={160}
                          height={80}
                          className="h-10 sm:h-12 w-auto object-contain"
                        />
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Gradient Overlays for smooth edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
          </div>
        </section>
      )}

      {/* Animated Stats Bar */}
      <AnimatedStats stats={stats} />

      {/* Digital Distinction & Technical Honor */}
      <section className="py-24 bg-white border-t border-slate-50">
        <div className="section-shell space-y-16">
          {/* Top Header Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-blue-600 text-[10px] font-extrabold uppercase tracking-[0.3em]">Engineering Distinction</span>
              <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Recognized for <br />
                <span className="text-blue-600 font-extrabold">Technical</span> Excellence
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
                Our commitment to bank-grade security and precision engineering has made us the trusted partner for Ghana's most ambitious digital projects.
              </p>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className="absolute inset-0 rounded-full border border-dashed border-blue-200/50 animate-spin-slow" />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="w-full h-full bg-blue-50/50 rounded-full flex items-center justify-center border border-blue-100 shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-cyan-400/5 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-48 h-48 md:w-64 md:h-64 transition-transform duration-700 group-hover:scale-110 mix-blend-multiply">
                      <Image
                        src="/images/awards.png"
                        alt="Skytech Engineering Award"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Distinction Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                category: "Industry Excellence",
                title: "Best Web & Mobile Development Agency 2023",
                desc: "Recognized for outstanding technical delivery and high-performance product architectures across the West African region.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                )
              },
              {
                category: "Technical Distinction",
                title: "Top-Rated Fintech & Banking Architecture",
                desc: "Voted as the premier engineering partner for secure, scalable financial systems and real-time transaction processing.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                category: "National Legacy",
                title: "Ghana's Most Trusted Digital Partner 2022",
                desc: "A prestigious national distinction cementing Skytech's status as the country's most reliable provider for enterprise software solutions.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              }
            ].map((award, idx) => (
              <div key={idx} className="group p-10 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500">
                <div className="mb-8 w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white">
                  {award.icon}
                </div>
                <div className="space-y-4">
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-blue-600/60">{award.category}</span>
                  <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                    {award.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {award.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing booklet */}
      <section className="py-24 bg-slate-50" id="pricing">
        <div className="section-shell space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="pill">Pricing</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1]">
              Simple Rate Card. <br />
              <span className="text-blue-600">Zero Surprises.</span>
            </h2>
            <p className="text-lg text-slate-600">
              Our pricing is transparent and based on real deliverables. Choose the package that fits your stage.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-6">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-[9px] font-extrabold uppercase tracking-widest shadow-xl shadow-slate-900/10">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Maintenance Covers All Site Offers
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[9px] font-extrabold uppercase tracking-widest shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Lowest rates compared to others like WopeDigital.com
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((pkg, idx) => (
              <div
                key={pkg.name}
                className={`group relative rounded-[2.5rem] p-10 transition-all duration-500 flex flex-col ${pkg.featured || idx === 1
                  ? "bg-slate-900 border-blue-600/30 shadow-2xl shadow-blue-500/10 scale-105 z-10"
                  : "bg-white border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5"
                  }`}
              >
                {/* Featured Badge */}
                {(pkg.featured || idx === 1) && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-blue-600/40">
                    Most Popular
                  </div>
                )}

                <div className={`space-y-2 mb-8 ${pkg.featured || idx === 1 ? 'text-white' : 'text-slate-900'}`}>
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest ${pkg.featured || idx === 1 ? 'text-blue-400' : 'text-blue-600'}`}>
                    {pkg.interval || "3–8 weeks"} timeline
                  </span>
                  <h3 className="text-2xl font-extrabold tracking-tight">{pkg.name}</h3>
                  <div className="pt-4 flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-sm font-bold ${pkg.featured || idx === 1 ? 'text-blue-400/50' : 'text-slate-400'}`}>GHS</span>
                      <span className="text-4xl font-extrabold">{pkg.price}</span>
                    </div>
                    <div className="flex items-baseline gap-1 opacity-60">
                      <span className="text-[10px] font-bold">USD</span>
                      <span className="text-lg font-extrabold">~${pkg.usd}</span>
                    </div>
                    {pkg.renewal && (
                      <div className={`mt-2 text-[9px] font-extrabold uppercase tracking-wider py-1.5 px-3 rounded-lg w-fit ${pkg.featured || idx === 1 ? 'bg-white/10 text-blue-300' : 'bg-slate-50 text-slate-500 border border-slate-100'
                        }`}>
                        Renew: GHS {pkg.renewal} yearly
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 flex-grow">
                  <ul className="space-y-3">
                    {pkg.highlights.map((item) => (
                      <li key={item} className={`flex items-center gap-3 text-sm ${pkg.featured || idx === 1 ? 'text-blue-100/70' : 'text-slate-600'}`}>
                        <svg className={`w-4 h-4 ${pkg.featured || idx === 1 ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10">
                  <Link
                    href="/site/contact"
                    className={`w-full inline-flex justify-center items-center px-6 py-4 rounded-2xl font-bold transition-all ${pkg.featured || idx === 1
                      ? 'bg-blue-600 text-white hover:bg-white hover:text-slate-900'
                      : 'bg-slate-50 text-slate-900 group-hover:bg-blue-600 group-hover:text-white'
                      }`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-16">
            <Link href="/site/pricing" className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-blue-600 hover:gap-3 transition-all">
              Not what you're looking for? View full catalog
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>


        </div>
      </section>


      {/* Gallery Bento Grid */}
      {galleryProjects.length >= 3 && (
        <section className="py-24 bg-slate-50">
          <div className="section-shell space-y-16">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <span className="pill">Portfolio</span>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                  Our Work in Action
                </h2>
                <p className="text-lg text-slate-600">
                  A showcase of recent websites and apps we've launched for our partners.
                </p>
              </div>
              <Link className="btn-secondary px-8 py-3 rounded-full" href="/site/gallery">
                View full gallery
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-[800px] md:h-[600px]">
              <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] bg-slate-900">
                {galleryProjects[0].image ? (
                  <Image
                    src={galleryProjects[0].image}
                    alt={galleryProjects[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-800 font-extrabold text-2xl uppercase tracking-[0.2em] -rotate-12 opacity-5">Project Featured</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-10 z-20">
                  <span className="pill bg-blue-600 text-white border-none mb-4">{galleryProjects[0].category}</span>
                  <h3 className="text-3xl font-extrabold text-white">{galleryProjects[0].title}</h3>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-200">
                {galleryProjects[1].image && (
                  <Image
                    src={galleryProjects[1].image}
                    alt={galleryProjects[1].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1 block">{galleryProjects[1].category}</span>
                  <h3 className="text-lg font-bold text-white">{galleryProjects[1].title}</h3>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-[2.5rem] bg-blue-600">
                {galleryProjects[2].image && (
                  <Image
                    src={galleryProjects[2].image}
                    alt={galleryProjects[2].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1 block">{galleryProjects[2].category}</span>
                  <h3 className="text-lg font-bold text-white">{galleryProjects[2].title}</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}



      {/* Testimonials */}
      {testimonials?.length ? (
        <section className="py-20 bg-white">
          <div className="section-shell space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="space-y-3">
                <span className="pill">Client outcomes</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  What partners say about us
                </h2>
                <p className="text-slate-600 max-w-2xl">
                  We build long-term partnerships anchored on transparency, speed,
                  and quality.
                </p>
              </div>
              <Link className="btn-secondary w-fit" href="/site/contact">
                Get a proposal
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((item) => (
                <div
                  key={item._id}
                  className="rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-sm"
                >
                  <p className="text-slate-700 leading-relaxed mb-6">
                    "{item.quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.author}
                      </p>
                      <p className="text-sm text-slate-500">{item.company}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 border border-slate-100">
                      {Array(item.rating || 5)
                        .fill("⭐")
                        .join("")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}




      {/* FAQ Preview Section (Horizontal Rail) */}
      <section className="section-shell space-y-16">
        <div className="pt-24 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 border-b border-slate-100 pb-8">
            <div className="space-y-4 text-left">
              <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-widest text-[10px] font-bold">Support</span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Common Questions</h2>
            </div>
            <Link href="/site/faqs" className="text-blue-600 text-xs font-extrabold uppercase tracking-widest hover:gap-2 flex items-center gap-1 transition-all">
              Full FAQ Center
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
            {faqsPreview.map((faq, idx) => (
              <div key={idx} className="flex-shrink-0 w-[350px] snap-start flex items-start gap-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                {/* Icon Left */}
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-extrabold text-sm">
                  ?
                </div>
                {/* Content Right */}
                <div className="space-y-2">
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                    {faq.question}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}

      {/* Final CTA Section (Surgical Compact) */}
      <section className="py-12 bg-white">
        <div className="section-shell">
          <div className="rounded-[2.5rem] bg-slate-50 border border-slate-100 p-10 lg:p-16 text-center space-y-8">
            <div className="space-y-3 max-w-3xl mx-auto">
              <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-widest text-[9px] font-bold">
                Next Steps
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                {homeContent.ctaTitle || "Engineering excellence delivered with precision."}
              </h2>
              <p className="text-base text-slate-500 max-w-2xl mx-auto">
                {homeContent.ctaSubtitle || "Tell us about your project. We'll provide a clear roadmap and the technical power to bring it to life."}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/site/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full font-extrabold text-base hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/15"
              >
                Start Your Project
              </Link>
              <Link
                href="/site/about"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-slate-200 text-slate-900 rounded-full font-extrabold text-base hover:bg-slate-50 transition-all"
              >
                Meet the Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview (Journal Style) - Relocated to Footer Anchor */}
      <section className="py-24 bg-white border-t border-slate-50">
        <div className="section-shell space-y-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-left">
              <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-widest text-[10px] font-bold">Latest Insights</span>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Latest from the lab
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Strategies and insights from our engineering team to help you navigate the digital landscape.
              </p>
            </div>
            <Link className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-bold transition-all hover:bg-blue-600 active:scale-95 shadow-xl shadow-slate-900/10" href="/site/blog">
              Read All Entries
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
            {latestPosts.map((post, idx) => (
              <Link key={post._id || idx} href={`/site/blog/${post.slug}`} className="flex-shrink-0 w-[350px] snap-start group flex items-start gap-5 p-2 rounded-[2.5rem] hover:bg-slate-50 transition-colors duration-300">
                {/* Image Left - Only if it exists */}
                {post.coverImage ? (
                  <div className="flex-shrink-0 w-32 h-24 overflow-hidden rounded-3xl bg-slate-100 border border-slate-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ) : null}

                {/* Content Right */}
                <div className={`space-y-2 pt-1 pr-4 ${!post.coverImage ? 'w-full' : ''}`}>
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-blue-600">
                    {post.category || 'INSIGHT'}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}


function LogoMarquee({ partners }) {
  const items = partners.slice(0, 20);
  if (!items.length) return null;
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-950 to-transparent" />
      <div className="py-6">
        <div className="flex gap-4 whitespace-nowrap will-change-transform animate-marquee [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          {row.map((p, idx) => (
            <div
              key={`${p.name || "partner"}-${idx}`}
              className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
              title={p.name || ""}
            >
              {p.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.logoUrl}
                  alt={p.name || "Partner logo"}
                  className="h-8 w-auto max-w-[160px] object-contain opacity-90"
                  loading="lazy"
                />
              ) : (
                <span className="text-sm font-semibold text-white/85">
                  {p.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PartnerGroup({ title, partners, variant = "light" }) {
  if (!partners?.length) return null;
  const card =
    variant === "dark"
      ? "rounded-3xl border border-white/10 bg-white/5 p-7"
      : "rounded-3xl border border-white/70 bg-white p-7 shadow-lg shadow-blue-500/5";
  const cell =
    variant === "dark"
      ? "flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-5"
      : "flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 px-4 py-5";
  const titleClass = variant === "dark" ? "text-white" : "text-slate-900";
  const fallbackText = variant === "dark" ? "text-white/85" : "text-slate-700";
  return (
    <div className={card}>
      <h3 className={`text-lg font-bold mb-4 ${titleClass}`}>{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {partners
          .filter((p) => p?.logoUrl || p?.name)
          .slice(0, 18)
          .map((partner, idx) => (
            <div
              key={`${partner.name || "partner"}-${idx}`}
              className={cell}
              title={partner.name || ""}
            >
              {partner.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={partner.logoUrl}
                  alt={partner.name || "Partner logo"}
                  className="h-10 w-auto max-w-[160px] object-contain"
                  loading="lazy"
                />
              ) : (
                <span className={`text-sm font-semibold ${fallbackText} text-center`}>
                  {partner.name}
                </span>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

function PricingSection({ pricingBookletUrl, websitePackages, appPackages, seoGrowthPlan }) {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PricingGroup title="Website development" packages={websitePackages} />
        <PricingGroup title="Mobile app development" packages={appPackages} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-100 p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
            <div className="space-y-2">
              <span className="pill">SEO</span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {seoGrowthPlan.name}
              </h3>
              <p className="text-slate-600">
                Monthly retainer for ongoing growth and rankings.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4">
              <p className="text-sm text-slate-600">From</p>
              <p className="text-xl font-extrabold text-slate-900">
                {seoGrowthPlan.priceRange}
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
            {seoGrowthPlan.items.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-950 text-white border border-white/10 p-8 shadow-sm">
          <h3 className="text-xl font-extrabold">Want the PDF?</h3>
          <p className="text-white/80 mt-2">
            You can still download the original booklet, but everything important
            is shown above.
          </p>
          <div className="mt-6 space-y-3">
            {pricingBookletUrl ? (
              <a
                className="btn-primary bg-white text-slate-950 hover:bg-slate-100 w-full"
                href={`/api/content/view-booklet?file=${encodeURIComponent(
                  pricingBookletUrl.split("/").pop()
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download pricing booklet
              </a>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                Booklet not uploaded yet.
              </div>
            )}
            <Link
              href="/site/contact"
              className="btn-secondary border-white/20 text-white hover:bg-white/10 w-full"
            >
              Get a custom quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingGroup({ title, packages }) {
  const list = packages || [];
  return (
    <div className="rounded-3xl bg-white border border-slate-100 p-8 shadow-sm">
      <div className="space-y-2">
        <span className="pill">{title}</span>
        <h3 className="text-2xl font-extrabold text-slate-900">
          Choose a package
        </h3>
        <p className="text-slate-600">
          Timelines and deliverables are included for each tier.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6">
        {list.map((pkg) => (
          <div
            key={pkg.name}
            className={`rounded-3xl border p-6 ${pkg.badge
              ? "border-blue-200 bg-blue-50/40"
              : "border-slate-100 bg-slate-50"
              }`}
          >
            <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="text-lg font-extrabold text-slate-900">
                    {pkg.name}
                  </p>
                  {pkg.badge ? (
                    <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                      {pkg.badge}
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-slate-600">{pkg.tagline}</p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-100 px-5 py-4 min-w-[220px]">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Starting at
                </p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">
                  {pkg.price}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Timeline: <span className="font-semibold">{pkg.timeline}</span>
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
              {pkg.highlights.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

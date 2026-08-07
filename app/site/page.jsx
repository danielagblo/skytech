import React from "react";
export const dynamic = 'force-dynamic';
import Link from "next/link";
import Image from "next/image";
import { getSettings } from '../lib/settings';
import { getPricing } from '../lib/pricing';
import { getAffiliates } from '../lib/affiliates';
import { getTestimonials } from '../lib/testimonials';
import { getBlogPosts } from '../admin/blog-actions';
import { getFAQs } from '../lib/faqs';

import WhyYouNeedUs from "../../components/skytech/sections/WhyYouNeedUs";
import FAQSection from "../../components/skytech/sections/FAQ";
import { groupFAQs } from "../../components/skytech/sections/faqGroup";
import LetsTalkButton from "../../components/skytech/ui/LetsTalkButton";
import PricingModel from "../../components/skytech/sections/PricingModel";
import TestimonialsBanner from "../../components/skytech/sections/home/TestimonialsBanner";
import TopScrollingBanner from "../../components/skytech/sections/home/TopScrollingBanner";
import AnimatedCounter from "../../components/skytech/sections/home/AnimatedCounter";

const services = [
  {
    title: "Website Development",
    items: 4,
    list: ["Corporate business", "E-commerce", "Blog content", "E-learning"],
    href: "/site/services",
  },
  {
    title: "Mobile App Development",
    items: 4,
    list: ["Corporate business", "E-commerce", "Blog content", "E-learning"],
    href: "/site/services",
  },
  {
    title: "IT Installations",
    items: 5,
    list: [
      "POS (Point of Sale) systems",
      "Wi-Fi Network Connection",
      "CCTV surveillance systems",
      "Inverter & solar panel",
      "Door and alarm installation",
    ],
    href: "/site/services/security-systems",
  },
];

export const metadata = {
  title: "Skytech Ghana - Website & Mobile App Developers",
  description:
    "Skytech Ghana builds websites and mobile apps for businesses in Ghana. Web design, SEO, and maintenance services.",
};

const stats = [
  { value: 8, suffix: "+", label: "Years in Operation", compact: false },
  { value: 8, suffix: "+", label: "Satisfied Customers", compact: false },
  { value: 1000, suffix: "+", label: "Projects Completed", compact: true },
  { value: 4, suffix: "+", label: "Countries Served", compact: false },
];

export default async function Home() {
  const settings = await getSettings();
  const testimonialsData = await getTestimonials();
  const testimonials = testimonialsData.length > 0 ? testimonialsData : [];
  const faqs = await getFAQs();
  const partnersData = await getAffiliates();
  const allPartners = (partnersData || []).filter((p) => p?.logoUrl || p?.name);
  const pricing = await getPricing();

  return (
    <div className="bg-white min-w-screen min-h-screen overflow-x-hidden relative">
      {/* Top Scrolling Banner (kept) */}
      <div className="md:fixed top-0 w-screen z-30">
        <TopScrollingBanner />
      </div>

      {/* ===== HERO (kept structure: full-bleed + headline + 2 CTAs + awards) ===== */}
      <section className="relative w-full min-h-[50vh] bg-slate-950 overflow-hidden flex items-center pt-16 md:pt-24">
        <Image
          src="/images/images/homePageBannerImage.png"
          fill
          className="object-cover opacity-35"
          alt="Background"
          priority
        />

        {/* Premium layered overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950" />
        <div className="pointer-events-none absolute inset-0 z-[1] opacity-20 bg-grid" />
        <div className="pointer-events-none absolute -top-32 right-0 h-[34rem] w-[34rem] rounded-full bg-brand-600/40 blur-[120px]" />

        <div className="section-shell relative z-10 w-full">
          <div className="grid h-full items-center md:grid-cols-[1.15fr_1fr]">
            {/* Copy */}
            <div className="mx-auto max-w-2xl py-8 text-center text-white md:text-left">
              <h1 className="font-display text-5xl font-bold uppercase leading-none tracking-tight sm:text-6xl md:text-7xl">
                8+ YEARS
                <span className="block whitespace-nowrap">IN OPERATION</span>
              </h1>

              {/* Awards — mobile (on top of the buttons) */}
              <div className="md:hidden mt-6 flex justify-center">
                <div className="flex items-end -space-x-8">
                  <div className="relative h-16 w-12">
                    <Image src="/images/images/homePageAward2.png" fill className="object-contain" alt="AWARD-EXCELLENCE 1" />
                  </div>
                  <div className="relative h-36 w-28">
                    <Image src="/images/images/homePageAward.png" fill className="object-contain" alt="NEWNEWAWARD 1" />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-3 md:mt-6 md:gap-4 md:justify-start">
                <Link href="/site/contact" className="btn-primary !px-4 !py-2 !text-xs md:!px-6 md:!py-3 md:!text-sm">
                  BOOK A MEETING
                </Link>
                <Link href="/site/pricing" className="btn-secondary !border-white/25 !bg-white/10 !px-4 !py-2 !text-xs !text-white backdrop-blur-sm hover:!bg-white/20 md:!px-6 md:!py-3 md:!text-sm">
                  PRICING
                </Link>
              </div>

              <p className="mt-6 mb-5 mx-auto max-w-sm text-center text-sm font-medium uppercase leading-relaxed tracking-wide text-slate-200 sm:max-w-md sm:text-base md:mx-0 md:max-w-none md:whitespace-nowrap md:text-left md:text-xl">
                For Website, Mobile App Development and IT Installations
              </p>
            </div>
          </div>
        </div>

        {/* Awards — desktop (kept up top-right) */}
        <div className="absolute top-[58%] right-10 z-10 hidden -translate-y-1/2 md:flex flex-col items-center">
          <div className="flex items-end -space-x-8">
            <div className="relative h-20 w-14">
              <Image src="/images/images/homePageAward2.png" fill className="object-contain" alt="AWARD-EXCELLENCE 1" />
            </div>
            <div className="relative h-48 w-36">
              <Image src="/images/images/homePageAward.png" fill className="object-contain" alt="NEWNEWAWARD 1" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Stats band (floating over hero) ===== */}
      <section className="relative z-20 -mt-8 px-4 sm:px-8 md:-mt-6">
        <div className="mx-auto max-w-[80rem] rounded-2xl border border-slate-200 bg-white p-8 shadow-lift md:p-10">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="space-y-2">
                <p className="font-display text-5xl font-bold tracking-tighter text-brand-600 md:text-6xl">
                  <AnimatedCounter value={s.value} suffix={s.suffix} compact={s.compact} />
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Sponsors Brand Row ===== */}
      <section className="py-20">
        <div className="section-shell mb-10 text-center">
          <span className="section-tag">Our Clients</span>
          <p className="section-title mt-3 text-balance">
            Trusted by over{" "}
            <span className="text-brand-600">1000+ brands</span> across two continents
          </p>
        </div>
        <div className="border-y border-slate-200 bg-slate-50/60 py-10">
          <div className="section-shell grid grid-cols-3 items-center gap-4 sm:grid-cols-4 md:grid-cols-6">
            {allPartners.map((partner, idx) => (
              <div key={`${idx}-${partner.name || partner.logoUrl}`} className="flex items-center justify-center">
                <img
                  src={partner.logoUrl}
                  alt={partner.name || "Brand"}
                  className="h-12 w-auto max-w-[12.5rem] object-contain md:h-14"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Digital Excellence Awards ===== */}
      <section className="bg-gradient-to-b from-white to-brand-50/50 py-24">
        <div className="section-shell">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="space-y-5">
              <span className="section-tag">Awards & Recognition</span>
              <h2 className="section-title text-balance">Recognized for digital excellence</h2>
              <p className="section-lead">
                Our commitment to exceptional digital business development and IT services has made us
                an award-winning agency trusted by businesses worldwide.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/site/about" className="btn-primary">Learn about us</Link>
                <Link href="/site/case-studies" className="btn-secondary">See our work</Link>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-br from-brand-200 to-brand-500 opacity-40 blur-2xl" />
                <div className="relative flex h-80 w-80 items-center justify-center rounded-full border border-brand-100 bg-white shadow-lift sm:h-96 sm:w-96">
                  <div className="relative h-56 w-56 sm:h-64 sm:w-64">
                    <Image src="/images/images/homePageAward.png" fill className="object-contain" alt="Award" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== IT Connecting Across Borders Globe ===== */}
      <section className="relative w-full h-[280px] bg-slate-950 overflow-hidden">
        <Image src="/images/images/globeImage.png" fill className="object-cover opacity-80 scale-110" alt="Globe Connections" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-slate-900/30" />
        <div className="section-shell relative z-10 flex h-full flex-col items-start justify-center gap-4 text-white md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">Global reach</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              IT connecting across borders.
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {["GhanaFlag", "KenyaFlag", "USFlag", "UKFlag", "NigeriaFlag"].map((flag) => (
              <div key={flag} className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-white/30">
                <Image src={`/images/icons/${flag}.svg`} fill className="object-cover scale-[1.35]" alt={flag} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== What Services We Offer Best (old style) ===== */}
      <section className="px-6 pt-10 md:pt-[3.75rem]">
        <p className="text-2xl uppercase md:text-4xl">
          What services do we <br /> offer best
        </p>
        <div className="mt-8 grid max-w-[3000px] grid-cols-1 items-start justify-center gap-4 md:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative h-full border-t-[5px] border-brand-600 bg-[#f6f6f6] p-6 pb-[5.625rem]"
            >
              <p className="text-xl font-semibold uppercase">{service.title}</p>
              <div className="pr-4">
                <hr className="mb-3 mt-0 border-t border-brand-600" />
                <ul className="mt-4 space-y-0 text-lg capitalize leading-7">
                  {service.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <Link
                href={service.href}
                className="absolute bottom-5 right-7 rounded-full border border-brand-600 bg-white px-3 py-2 transition-all duration-300 hover:scale-[0.97] hover:bg-gray-100 active:scale-[1.02]"
              >
                &#10132;
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Pricing ===== */}
      <section id="pricing">
        <PricingModel categories={pricing} showWhyYouNeedUs={false} />
      </section>

      {/* ===== Why you need us ===== */}
      <WhyYouNeedUs />

      {/* ===== Testimonials (kept: dual marquee) ===== */}
      <TestimonialsBanner
        testimonials={testimonials.map((t) => ({
          quote: t.quote || "",
          name: t.author || "",
          title: t.company || "",
        }))}
      />

      {/* ===== Work With Us + FAQs ===== */}
      <section className="bg-white pt-8 md:px-10 md:pt-20">
        <div className="relative mx-auto flex max-md:w-[90%] max-md:flex-col max-md:items-center max-md:justify-center max-md:pt-[3rem] max-md:pb-[9rem] max-md:bg-[#016DAB] max-md:rounded-2xl md:justify-end md:overflow-visible md:rounded-2xl md:bg-[#016DAB] md:pb-10 md:pr-[10rem]">
          <Image
            src="/images/images/workWithUs.png"
            alt="Work With Us"
            width={882}
            height={942}
            className="absolute object-contain max-md:left-1/2 max-md:h-[26rem] max-md:w-[26rem] max-md:-translate-x-1/2 md:-bottom-[12.5rem] md:-left-[3.75rem] md:mb-0 md:h-[47.5rem] md:w-[47.5rem]"
          />
          <LetsTalkButton
            whatsapp={settings.whatsapp}
            className="bg-white/20 text-white max-md:absolute max-md:bottom-3 max-md:right-3 md:my-[7.5rem]"
          />
        </div>

        <FAQSection faqs={groupFAQs(faqs)} />
      </section>
    </div>
  );
}
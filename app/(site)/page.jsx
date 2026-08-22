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
import { getAllBlogPosts } from '../lib/blog';
import { getHeroData } from '../lib/hero';

import WhyYouNeedUs from "../../components/skytech/sections/WhyYouNeedUs";
import FAQSection from "../../components/skytech/sections/FAQ";
import { groupFAQs } from "../../components/skytech/sections/faqGroup";
import PricingModel from "../../components/skytech/sections/PricingModel";
import TestimonialsBanner from "../../components/skytech/sections/home/TestimonialsBanner";
import AnimatedCounter from "../../components/skytech/sections/home/AnimatedCounter";
import ClientsCarousel from "../../components/skytech/sections/home/ClientsCarousel";
import LatestInsights from "@/components/LatestInsights";
import HeroHeadline from "@/components/skytech/ui/HeroHeadline";

const services = [
  {
    title: "Website Development",
    items: 4,
    list: ["Corporate business", "E-commerce", "Blog content", "E-learning"],
    href: "/services",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6L6 12l6 6M14 6l6 6-6 6" />
    ),
  },
  {
    title: "Mobile App Development",
    items: 4,
    list: ["Corporate business", "E-commerce", "Blog content", "E-learning"],
    href: "/services",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 1.5H8.75a1.5 1.5 0 00-1.5 1.5v18a1.5 1.5 0 001.5 1.5h7.5a1.5 1.5 0 001.5-1.5V3a1.5 1.5 0 00-1.5-1.5zM12 18.75h.008v.008H12v-.008z" />
    ),
  },
  {
    title: "SEO Growth",
    items: 4,
    list: [
      "SEO Optimization",
      "Technical SEO",
      "Keyword Strategy",
      "On & Off-page SEO",
    ],
    href: "/seo",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.25c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v6.75A1.125 1.125 0 016.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    ),
  },
];

export const metadata = {
  title: "Skytech Ghana - Website Development Company in Ghana | Mobile App Developers",
  description:
    "Skytech Ghana builds websites and mobile apps for businesses in Ghana. Web design, SEO, and maintenance services.",
};

export default async function Home() {
  const hero = await getHeroData();
  const settings = await getSettings();
  const testimonialsData = await getTestimonials();
  const testimonials = testimonialsData.length > 0 ? testimonialsData : [];
  const faqs = await getFAQs();
  const partnersData = await getAffiliates();
  const allPartners = (partnersData || []).filter((p) => p?.logoUrl || p?.name);
  const pricing = await getPricing();
  const posts = await getAllBlogPosts();
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="bg-white min-w-screen min-h-screen overflow-x-hidden relative">


      {/* ===== HERO (kept structure: full-bleed + headline + 2 CTAs + awards) ===== */}
      <section className="relative w-full min-h-[50vh] bg-slate-950 overflow-hidden flex items-center mt-0 pt-[140px] md:pt-[180px]">
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
              <HeroHeadline headlines={hero.headlines} mode={hero.headlineMode} />

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
                <Link href="/contact" className="btn-primary !px-4 !py-2 !text-xs md:!px-6 md:!py-3 md:!text-sm">
                  BOOK A MEETING
                </Link>
                <Link href="/pricing" className="btn-secondary !border-white/25 !bg-white/10 !px-4 !py-2 !text-xs !text-white backdrop-blur-sm hover:!bg-white/20 md:!px-6 md:!py-3 md:!text-sm">
                  PRICING
                </Link>
              </div>

              <p className="mt-6 mb-5 mx-auto max-w-sm text-center text-sm font-medium uppercase leading-relaxed tracking-wide text-slate-200 sm:max-w-md sm:text-base md:mx-0 md:max-w-none md:whitespace-nowrap md:text-left md:text-xl">
                {hero.subText}
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
        <div className="mx-auto max-w-[80rem] rounded-none border border-slate-200 bg-white p-8 shadow-lift md:p-10">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {hero.stats.map((s) => (
              <div key={s.label} className="space-y-2">
                <p className="font-display text-3xl font-bold tracking-tighter text-slate-950 sm:text-6xl md:text-7xl">
                  <AnimatedCounter value={s.value} suffix={s.suffix} compact={s.compact} />
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Sponsors Brand Row ===== */}
      <section className="py-16 sm:py-20">
        <div className="section-shell mb-10 text-center">
          <span className="section-tag">Our Partners</span>
        </div>
        <ClientsCarousel partners={allPartners} />
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
                <Link href="/about" className="btn-primary">Learn about us</Link>
                <Link href="/case-studies" className="btn-secondary">See our work</Link>
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

      <section className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/40 to-white py-16 md:py-24">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 bg-grid-light" />
        <div className="pointer-events-none absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-brand-200/40 blur-[120px]" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[24rem] w-[24rem] rounded-full bg-cyan-200/40 blur-[120px]" />

        <div className="section-shell relative z-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="section-tag">What we do best</span>
              <h2 className="section-title mt-3 text-balance">
                What services do we <span className="text-brand-600">offer best</span>
              </h2>
            </div>
            <p className="section-lead max-w-md">
              From the web to mobile to search — one partner for everything your brand needs to win online.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 items-start gap-5 md:mt-16 md:grid-cols-3 md:gap-6">
            {services.map((service, index) => (
              <article
                key={service.title}
                className="group relative flex h-full flex-col border border-slate-200 bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-lift md:p-8"
              >
                <div className="absolute inset-x-0 top-0 h-[5px] bg-brand-600" />

                <div className="mb-6 flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-none bg-brand-50 text-brand-600 transition-all duration-500 group-hover:bg-brand-600 group-hover:text-white">
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      {service.icon}
                    </svg>
                  </span>
                  <span className="font-display text-5xl font-bold leading-none text-slate-900/5 transition-colors duration-500 group-hover:text-brand-600/10">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-semibold text-slate-900">{service.title}</h3>
                <div className="mt-5 border-t border-brand-600 pt-5">
                  <ul className="space-y-3">
                    {service.list.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm font-medium capitalize text-slate-700 transition-colors duration-300 group-hover:text-slate-900 md:text-base"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-brand-600/10 text-brand-600">
                          <svg
                            className="h-3 w-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={service.href}
                  className="mt-auto inline-flex items-center gap-2 pt-7 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 transition-colors duration-300 group-hover:text-brand-700"
                >
                  Explore
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
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

      {/* ===== Latest Insights ===== */}
      <LatestInsights latestPosts={latestPosts} />

      {/* ===== FAQs ===== */}
      <section className="bg-white pt-8 md:px-10 md:pt-20">
        <FAQSection faqs={groupFAQs(faqs)} />
      </section>
    </div>
  );
}
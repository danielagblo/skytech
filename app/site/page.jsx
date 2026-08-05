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
    title: "website development",
    list: ["corporate business", "e-commerce", "blog content", "e-learning"],
    href: "/site/services",
  },
  {
    title: "mobile app development",
    list: ["corporate business", "e-commerce", "blog content", "e-learning"],
    href: "/site/services",
  },
  {
    title: "IT installations",
    list: [
      "POS (Point of Sale) systems",
      "Wi-Fi Network Connection",
      "CCTV surveillance systems",
      "inverter & solar panel",
      "door and alarm installation",
    ],
    href: "/site/services/security-systems",
  },
];

export const metadata = {
  title: "Skytech Ghana - Website & Mobile App Developers",
  description:
    "Skytech Ghana builds websites and mobile apps for businesses in Ghana. Web design, SEO, and maintenance services.",
};

export default async function Home() {
  const settings = await getSettings();
  const testimonialsData = await getTestimonials();
  const testimonials = testimonialsData.length > 0 ? testimonialsData : [];
  const allPosts = await getBlogPosts();
  const latestPosts = allPosts.filter(p => p.published).slice(0, 3);
  const faqs = await getFAQs();
  const partnersData = await getAffiliates();
  const allPartners = (partnersData || []).filter((p) => p?.logoUrl || p?.name);
  const pricing = await getPricing();

  return (
    <div className="bg-[#FFF] min-w-screen min-h-screen overflow-x-hidden relative">
      {/* Top Scrolling Banner */}
      <div className="md:fixed top-0 w-screen z-20">
        <TopScrollingBanner />
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[50vh] min-h-[400px] bg-black overflow-hidden">
        <Image
          src="/images/images/homePageBannerImage.png"
          fill
          className="object-cover opacity-50"
          alt="Background"
          priority
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />

        <div className="section-shell relative z-10 h-full flex flex-col justify-center text-white space-y-6">
          <span className="text-[#FFF] font-inter text-5xl md:text-6xl font-bold tracking-wider uppercase">
            8+ YEARS IN OPERATION
          </span>

          <p className="text-[#FFF] font-inter text-lg md:text-xl max-w-2xl opacity-90 leading-relaxed">
            FOR WEBSITE, MOBILE APP DEVELOPMENT AND IT INSTALLATIONS
          </p>

          <div className="flex gap-4">
            <Link href="/site/contact" className="bg-[#1E5AC8] hover:bg-blue-700 text-white font-inter text-base font-bold px-8 py-3.5 transition-all">
              BOOK A MEETING
            </Link>
            <Link href="/site/pricing" className="bg-white hover:bg-slate-100 text-black font-inter text-base font-bold px-8 py-3.5 transition-all">
              PRICING
            </Link>
          </div>
        </div>

        {/* Floating Award Trophy Graphic */}
        <div className="absolute right-10 bottom-8 z-10 hidden lg:flex flex-col items-center gap-2">
          <div className="flex items-end gap-3 h-48">
            <div className="relative w-20 h-28">
              <Image
                src="/images/images/homePageAward2.png"
                fill
                className="object-contain"
                alt="AWARD-EXCELLENCE 1"
              />
            </div>
            <div className="relative w-36 h-44">
              <Image
                src="/images/images/homePageAward.png"
                fill
                className="object-contain"
                alt="NEWNEWAWARD 1"
              />
            </div>
          </div>
          <p className="text-[#FFF] font-inter text-base font-bold tracking-[0.1em] uppercase">
            2+ TOP AWARDS
          </p>
        </div>
      </div>

      {/* Key Stats Counter Grid */}
      <section className="bg-[#FDFDFD] border-y border-slate-200 py-12">
        <div className="section-shell">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-[#000] font-inter text-5xl md:text-7xl font-semibold tracking-tighter">
                <AnimatedCounter value={8} suffix="+" />
              </p>
              <p className="text-[#000] font-inter text-sm font-bold tracking-[0.2em] uppercase text-slate-500">YEARS IN OPERATION</p>
            </div>
            <div className="space-y-2">
              <p className="text-[#000] font-inter text-5xl md:text-7xl font-semibold tracking-tighter">
                <AnimatedCounter value={8} suffix="+" />
              </p>
              <p className="text-[#000] font-inter text-sm font-bold tracking-[0.2em] uppercase text-slate-500">SATISFIED CUSTOMERS</p>
            </div>
            <div className="space-y-2">
              <p className="text-[#000] font-inter text-5xl md:text-7xl font-semibold tracking-tighter">
                <AnimatedCounter value={1000} suffix="+" compact />
              </p>
              <p className="text-[#000] font-inter text-sm font-bold tracking-[0.2em] uppercase text-slate-500">PROJECTS COMPLETED</p>
            </div>
            <div className="space-y-2">
              <p className="text-[#000] font-inter text-5xl md:text-7xl font-semibold tracking-tighter">
                <AnimatedCounter value={4} suffix="+" />
              </p>
              <p className="text-[#000] font-inter text-sm font-bold tracking-[0.2em] uppercase text-slate-500">COUNTRIES SERVED</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Brand Marquee */}
      <section className="py-16 bg-[#FFF] border-b border-slate-100">
        <div className="section-shell mb-8 text-center">
          <h2 className="text-[#000] font-inter text-2xl font-bold tracking-tight">
            WE’RE TRUSTED BY OVER <span className="text-[#1E5AC8]">1000+ BRANDS</span>
          </h2>
        </div>
        <div className="bg-[rgba(30,90,200,0.05)] py-6 overflow-hidden relative">
          <div className="flex animate-marquee items-center gap-16 whitespace-nowrap">
            {[...Array(3)].map((_, i) => (
              <React.Fragment key={i}>
                {allPartners.map((partner, idx) => (
                  <img
                    key={`${i}-${idx}`}
                    src={partner.logoUrl}
                    alt={partner.name || "Brand"}
                    className="h-12 w-auto object-contain inline-block"
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Excellence Awards Section */}
      <section className="py-24 bg-white">
        <div className="section-shell">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-slate-800 font-inter text-3xl sm:text-4xl font-medium leading-[1.15] tracking-tight">
                RECOGNIZE FOR DIGITAL EXCELLENCE
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Our commitment to delivering exceptional digital business development and other IT Services has made us an award-winning agency trusted by businesses worldwide.
              </p>
            </div>
            
            {/* Single Trophy with Circle Background */}
            <div className="flex justify-center">
              <div className="relative w-80 h-80 rounded-full border-[20px] border-slate-50 bg-white flex items-center justify-center shadow-inner">
                <div className="relative w-56 h-56">
                  <Image src="/images/images/homePageAward.png" fill className="object-contain" alt="Award 1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IT Connecting Across Borders Globe Section */}
      <section className="relative w-full h-[280px] bg-black overflow-hidden flex items-start pt-4 -mt-20 z-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/images/globeImage.png"
            fill
            className="object-cover opacity-95 scale-110"
            alt="Globe Connections"
            priority
          />
        </div>
        
        <div className="section-shell relative z-20 w-full flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="md:w-1/2" />
          <div className="flex flex-col items-center md:items-end gap-3 text-right">
            <h2 className="text-2xl sm:text-3xl font-inter font-normal tracking-tight">
              IT Connecting across borders.
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative w-14 h-14 rounded-full overflow-hidden aspect-square">
                <Image src="/images/icons/GhanaFlag.svg" fill className="object-cover scale-[1.35]" alt="Ghana" />
              </div>
              <div className="relative w-14 h-14 rounded-full overflow-hidden aspect-square">
                <Image src="/images/icons/KenyaFlag.svg" fill className="object-cover scale-[1.35]" alt="Kenya" />
              </div>
              <div className="relative w-14 h-14 rounded-full overflow-hidden aspect-square">
                <Image src="/images/icons/USFlag.svg" fill className="object-cover scale-[1.35]" alt="United States" />
              </div>
              <div className="relative w-14 h-14 rounded-full overflow-hidden aspect-square">
                <Image src="/images/icons/UKFlag.svg" fill className="object-cover scale-[1.35]" alt="United Kingdom" />
              </div>
              <div className="relative w-14 h-14 rounded-full overflow-hidden aspect-square">
                <Image src="/images/icons/NigeriaFlag.svg" fill className="object-cover scale-[1.35]" alt="Nigeria" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Services We Offer Best */}
      <section className="pt-10 px-6 bg-white md:pt-[3.75rem]">
        <p className="text-2xl uppercase md:text-4xl">
          What services do we <br /> offer best
        </p>
        <div className="grid grid-cols-1 gap-4 max-w-[3000px] items-start justify-center mt-8 md:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-[#f6f6f6] relative pb-[5.625rem] p-6 h-full border-t-[5px] border-[#1E5AC8]"
            >
              <p className="text-xl font-semibold uppercase">{service.title}</p>
              <div className="pr-4">
                <hr className="text-[#1E5AC8]" />
                <ul className="mt-4 capitalize leading-7 text-lg">
                  {service.list.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
              <Link
                href={service.href}
                className="absolute bg-white bottom-5 border rounded-full py-2 px-3 border-[#1E5AC8] right-7 hover:bg-gray-100 cursor-pointer hover:scale-[0.97] active:scale-[1.02] transition-all duration-300"
              >
                &#10132;
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Simple Rate Card with Zero Surprises */}
      <PricingModel categories={pricing} showWhyYouNeedUs={false} />

      {/* Here is why you need us */}
      <WhyYouNeedUs />

      {/* Testimonials */}
      <TestimonialsBanner
        testimonials={testimonials.map((t) => ({
          quote: t.quote || "",
          name: t.author || "",
          title: t.company || "",
        }))}
      />

      {/* Work With Us + FAQs */}
      <section className="bg-white pt-8 md:pt-20 md:px-10">
        <div className="relative max-md:w-[90%] max-md:mx-auto bg-[#016DAB] rounded-2xl flex flex-col items-center max-md:pt-[6.25rem] max-md:pb-[8.5rem] justify-center overflow-hidden md:pb-10 md:flex-row md:justify-end md:overflow-visible md:pr-[10rem]">
          <Image
            src="/images/images/workWithUs.png"
            alt="Work With Us"
            width={882}
            height={942}
            className="mb-4 object-contain absolute md:-left-[3.75rem] md:-bottom-[12.5rem] md:mb-0 md:h-[47.5rem] md:w-[47.5rem]"
          />
          <LetsTalkButton whatsapp={settings.whatsapp} className="bg-white/20 max-md:absolute max-md:bottom-3 max-md:right-3 text-white md:my-[7.5rem]" />
        </div>

        <FAQSection faqs={groupFAQs(faqs)} />
      </section>
    </div>
  );
}

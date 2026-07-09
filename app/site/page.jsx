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
import AnimatedHero from "../../components/AnimatedHero";
import HeroSlideshow from "../../components/HeroSlideshow";
import AnimatedStats from "../../components/AnimatedStats";
import FAQAccordion from "../../components/FAQAccordion";
import TestimonialsSection from "../../components/TestimonialsSection";
import WhyChooseUsSection from "../../components/WhyChooseUsSection";
import EngineeringDistinction from "../../components/EngineeringDistinction";
import AnimatedPricing from "../../components/AnimatedPricing";
import LatestInsights from "../../components/LatestInsights";

export const metadata = {
  title: "Skytech Ghana - Website & Mobile App Developers",
  description:
    "Skytech Ghana builds websites and mobile apps for businesses in Ghana. Web design, SEO, and maintenance services.",
};

const stats = [
  { label: "Years in business", value: "10+" },
  { label: "Satisfied clients", value: "100+" },
  { label: "Projects delivered", value: "150+" },
  { label: "Countries served", value: "03+" },
];export default async function Home() {
  const heroData = await getHeroData();
  const pricingData = await getPricing();
  const webPricing = pricingData.find(c => c.category === 'web') || { packages: [] };
  const pricing = webPricing.packages.slice(0, 3); // Get first 3 packages

  const testimonialsData = await getTestimonials();
  const testimonials = testimonialsData.length > 0 ? testimonialsData : [];


  const settings = await getSettings();
  const pricingBookletUrl = settings.pricingBookletUrl || "/static/pricing.pdf";


  const allPosts = await getBlogPosts();
  const latestPosts = allPosts.filter(p => p.published).slice(0, 3);

  const projects = await getProjects();
  const galleryProjects = projects.slice(0, 3);

  const faqs = await getFAQs();

  const hero = {
    title: "We build websites & apps that grow your business.",
    subtitle: "Website & App Development Company in Ghana",
    imageUrl: heroData?.imageUrl || "/images/hero-3.png"
  };

  const partnersData = await getAffiliates();
  const allPartners = (partnersData || []).filter((p) => p?.logoUrl || p?.name);

  return (
    <>
      <AnimatedHero
        imageUrl={hero.imageUrl}
        title={hero.title}
        subtitle={hero.subtitle}
      />

      {/* Affiliate Network (Dynamic Marquee) */}
      {allPartners.length > 0 && (
        <section className="relative bg-white py-12 border-b border-slate-100 overflow-hidden">
          {/* Corner Badge */}
          <div className="absolute top-0 left-0 bg-blue-600 text-white px-5 py-2 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-lg z-10 rounded-br-lg">
            Our Partners
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
      <EngineeringDistinction />

      {/* Pricing booklet */}
      <AnimatedPricing pricing={pricing} />


      {/* Gallery Bento Grid */}
      {galleryProjects.length >= 3 && (
        <section className="py-24 bg-slate-50">
          <div className="section-shell space-y-16">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <span className="pill">Portfolio</span>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                  Recent Projects
                </h2>
                <p className="text-lg text-slate-600">
                  A selection of websites and apps we've built for our clients.
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
      {testimonials?.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}




      {/* FAQ Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="section-shell space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="pill">Support</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Got questions about our services, pricing, or process? We've got answers.
            </p>
          </div>

          <FAQAccordion faqs={faqs} />

          <div className="text-center">
            <Link href="/site/faqs" className="group inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-blue-600 hover:gap-3 transition-all">
              Full FAQ Center
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <LatestInsights latestPosts={latestPosts} />
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



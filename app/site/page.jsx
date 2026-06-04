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
              Our platform is built to help you work smarter, not harder. It adapts to your needs and supports your goals. Make the most of every feature.
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

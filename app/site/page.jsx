import Link from "next/link";
import dbConnect from '../lib/mongodb';
import Testimonial from '../models/Testimonial';
import Service from '../models/Service';
import { getSettings } from '../lib/settings';
import { getPageContent } from '../lib/pages';
import FreeAuditForm from "../../components/FreeAuditForm";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Skytech Ghana - Website & Mobile App Developers",
  description:
    "Skytech Ghana builds websites and mobile apps for businesses. Simple, clear, and focused on results.",
};

async function getTestimonials() {
  try {
    await dbConnect();
    return await Testimonial.find({}).lean();
  } catch (error) {
    console.error('Failed to fetch testimonials from MongoDB:', error);
    return [];
  }
}

async function getServices() {
  try {
    await dbConnect();
    return await Service.find({}).lean();
  } catch (error) {
    console.error('Failed to fetch services from MongoDB:', error);
    return [];
  }
}

export default async function Home() {
  const testimonials = await getTestimonials();
  const settings = await getSettings();
  const services = await getServices();
  const pricingBookletUrl = settings.pricingBookletUrl || "";
  const pricing = settings.pricing || {};
  const affiliateNetwork = settings.affiliateNetwork || { multinational: [], local: [] };
  const awards = settings.awards || [];
  const pages = await getPageContent();
  const homeContent = pages.home || {};
  const allPartners = [
    ...(affiliateNetwork.multinational || []),
    ...(affiliateNetwork.local || []),
  ].filter((p) => p?.logoUrl || p?.name);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pb-20 pt-24 sm:pt-28">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute -top-24 -left-10 h-72 w-72 rounded-full bg-blue-600/40 blur-3xl" />
          <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl" />
        </div>
        <div className="section-shell relative grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center">
          <div className="space-y-6">
            <span className="pill bg-white/10 text-white border border-white/10">
              Website design + SEO + growth features
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              {homeContent.heroTitle ||
                "World‑class websites that help you rank on Google and convert more customers."}
            </h1>
            <p className="text-lg text-slate-200/90 max-w-2xl">
              {homeContent.heroSubtitle ||
                "We design and build modern websites and apps, then improve performance, SEO, and lead capture so your business grows steadily."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/site/contact" className="btn-primary">
                Book a discovery call
              </Link>
              <Link href="#pricing" className="btn-secondary border-white/20 text-white hover:bg-white/10">
                View pricing
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-200/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:justify-self-end">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-7 shadow-xl shadow-slate-900/20">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">
                Free website audit
              </p>
              <h2 className="text-2xl font-extrabold mt-2">
                Get SEO + speed improvements instantly
              </h2>
              <p className="text-sm text-white/80 mt-2 mb-5">
                Share your website. We’ll respond with clear, prioritized fixes.
              </p>
              <FreeAuditForm />
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-white/80">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  ✅ Core Web Vitals
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  ✅ On‑page SEO
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  ✅ Conversion fixes
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  ✅ Quick wins
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate network (trust first) */}
      {allPartners.length ? (
        <section className="bg-slate-950 text-white py-14 border-t border-white/5">
          <div className="section-shell space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <span className="pill bg-white/10 text-white border border-white/10">
                  Affiliate network
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Trusted by top teams
                </h2>
                <p className="text-white/80">
                  A snapshot of organizations we’ve supported.
                </p>
              </div>
              <Link
                href="/site/contact"
                className="btn-secondary border-white/20 text-white hover:bg-white/10 w-fit"
              >
                Work with us
              </Link>
            </div>

            <LogoMarquee partners={allPartners} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PartnerGroup
                title="Multinational partners"
                partners={affiliateNetwork.multinational || []}
                variant="dark"
              />
              <PartnerGroup
                title="Local partners"
                partners={affiliateNetwork.local || []}
                variant="dark"
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="section-shell space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="pill">Why people choose us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {homeContent.featuresSectionTitle || "We keep it simple and honest."}
            </h2>
            <p className="text-slate-600">
              {homeContent.featuresSectionSubtitle || "Clear updates, clean work, and results you can see."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/70 bg-white p-7 shadow-lg shadow-blue-500/5 hover:-translate-y-1 transition-transform"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      {services?.length ? (
        <section className="py-20 bg-white">
          <div className="section-shell space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="space-y-3">
                <span className="pill">What we do</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  {homeContent.servicesSectionTitle || "We build and improve websites and apps."}
                </h2>
                <p className="text-slate-600 max-w-2xl">
                  {homeContent.servicesSubtitle || "New product or old one, we help you make it work better."}
                </p>
              </div>
              <Link className="btn-secondary w-fit" href="/site/services">
                View all services
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.slice(0, 4).map((service) => (
                <div
                  key={service.id}
                  className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
                >
                  <div className="text-3xl mb-3">{service.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Process */}
      <section className="py-20 bg-slate-50">
        <div className="section-shell space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="pill">How we work</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              We plan, build, test, and launch.
            </h2>
            <p className="text-slate-600">
              You get clear steps and regular updates, so nothing is confusing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-sm font-bold text-blue-700">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                  key={item.id}
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

      {/* Awards */}
      {awards.length ? (
        <section className="py-20 bg-slate-50">
          <div className="section-shell">
            <div className="rounded-3xl border border-white/70 bg-white p-8 shadow-lg shadow-blue-500/5">
              <div className="space-y-2 max-w-2xl">
                <span className="pill">Distinction & honor</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  A legacy of recognized work
                </h3>
                <p className="text-slate-600">
                  Milestones that reflect service quality and consistent delivery.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {awards.slice(0, 6).map((award) => (
                  <div
                    key={`${award.title}-${award.subtitle}`}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-6"
                  >
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                      🏆
                    </div>
                    <p className="font-bold text-slate-900 leading-snug">
                      {award.title}
                    </p>
                    {award.subtitle ? (
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                        {award.subtitle}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Pricing booklet */}
      <section className="py-20 bg-slate-50" id="pricing">
        <div className="section-shell space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="pill">Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Clear packages. Real deliverables.
            </h2>
            <p className="text-slate-600">
              Pricing below is taken directly from our rate card and presented
              here so you don’t have to download a booklet to understand costs.
            </p>
          </div>

          <PricingSection
            pricingBookletUrl={pricingBookletUrl}
            websitePackages={pricing.websitePackages || websitePackages}
            appPackages={pricing.appPackages || appPackages}
            seoGrowthPlan={pricing.seoGrowthPlan || seoGrowthPlan}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-r from-blue-700 to-blue-500 text-white">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="section-shell relative text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
              {homeContent.ctaTitle || "Ready to build your website or app?"}
          </h2>
          <p className="text-lg text-white/85 max-w-2xl mx-auto">
              {homeContent.ctaSubtitle || "Tell us what you need. We will give you a clear plan and next steps."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/site/contact"
              className="btn-primary bg-white text-blue-700 hover:bg-blue-50 shadow-white/30"
            >
              Start a project
            </Link>
            <Link
              href="/site/about"
              className="btn-secondary border-white/60 text-white hover:bg-white/10"
            >
              Meet the team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

const stats = [
  { label: "Projects delivered", value: "180+" },
  { label: "Avg. faster to MVP", value: "3x" },
  { label: "Client NPS", value: "72" },
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
      "Free speed optimization",
      "Free hosting for 12 months",
    ],
  },
  {
    name: "Standard Business Package",
    tagline: "Most Popular – For Growing Brands",
    timeline: "2–3 months",
    price: "GHS 6,500",
    highlights: [
      "10–12 pages",
      "Advanced SEO (keywords, ranking, metadata, indexing)",
      "Custom contact forms + automated email responses",
      "Live chat system",
      "Testimonials, portfolio, gallery",
      "Blog with admin access (CMS)",
      "Analytics dashboard (visitors, insights, conversions)",
      "3 business emails",
      "Security hardening",
      "Google Business Profile optimization",
    ],
    badge: "Most popular",
  },
  {
    name: "E-commerce/Booking Package",
    tagline: "For Retail, Restaurants, Real Estate & Service Businesses",
    timeline: "3–6 months",
    price: "GHS 25,000",
    highlights: [
      "Full online store or booking system",
      "Product uploads (up to 50 items)",
      "Payment integrations (Visa, Momo, Paystack)",
      "Stock management",
      "Coupon/discount system",
      "Cart abandonment recovery",
      "Automated order emails",
      "Secure dashboard for product & sales control",
      "Advanced SEO + schema for Google",
      "Live chat + WhatsApp + support desk",
      "5 business emails",
      "Free analytics setup (Google Analytics + Search Console)",
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
      "Brand kit creation",
      "Hosting not included",
    ],
  },
];

const seoGrowthPlan = {
  name: "Professional SEO Growth Plan",
  priceRange: "GHS 600/month – GHS 2,000/month",
  items: [
    "Keyword ranking",
    "Backlinks",
    "Blog content",
    "Technical SEO",
    "Monthly reports",
  ],
};

const appPackages = [
  {
    name: "Starter App Package",
    tagline: "Best for small businesses & personal brands",
    timeline: "2–3 weeks",
    price: "GHS 12,000",
    highlights: [
      "Cross-platform app (Android + iOS ready)",
      "5 main screens (Home, About/Services, Contact)",
      "Basic UI/UX design",
      "Simple dashboard",
      "1 API integration (WhatsApp, Contact form, Payment link)",
      "Push notifications (basic)",
      "1-month free support",
    ],
  },
  {
    name: "Business Growth Package",
    tagline: "Best for SMEs, e-commerce, service companies",
    timeline: "4–6 weeks",
    price: "GHS 24,000",
    highlights: [
      "Fully functional Android & iOS app",
      "8–12 screens (custom UI/UX)",
      "User authentication (Email/Phone login)",
      "Payment gateway integration",
      "Booking system / E-commerce store",
      "Analytics integration (Firebase)",
      "Admin panel for app management",
      "Push notifications",
      "2 months support",
      "SEO-Optimized app listing (Play Store & App Store)",
    ],
    badge: "Most popular",
  },
  {
    name: "Enterprise App Package",
    tagline: "Best for large companies, marketplaces, delivery apps, finance apps",
    timeline: "2–3 months",
    price: "GHS 80,000",
    highlights: [
      "Native-like performance (Android & iOS)",
      "Up to 25 screens (custom UI/UX)",
      "Advanced authentication (OTP, 2FA, Social Login)",
      "Full e-commerce or marketplace integration",
      "Wallet system / subscription system",
      "Real-time chat",
      "Advanced admin dashboard + analytics",
      "Role-based access for company staff",
      "API development + third-party integrations",
      "Full branding & Play Store/App Store optimization",
      "3 months support + maintenance",
    ],
  },
  {
    name: "Advanced Marketplace & Fintech Package",
    tagline: "For marketplace / fintech apps (Uber-like, Bolt-like, wallets, loans)",
    timeline: "3–6 months",
    price: "GHS 120,000",
    highlights: [
      "Android & iOS apps + Web Admin + Vendor Portal",
      "Real-time location tracking",
      "In-app wallet + payment orchestration",
      "Chat & notifications",
      "Multi-vendor system",
      "Advanced security (bank-grade encryption)",
      "API gateway + cloud infrastructure setup",
      "6 months premium support",
    ],
  },
];

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
            className={`rounded-3xl border p-6 ${
              pkg.badge
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

import Link from "next/link";
import Image from "next/image";
import dbConnect from '../lib/mongodb';
import Testimonial from '../models/Testimonial';
import Service from '../models/Service';
import { getSettings } from '../lib/settings';
import { getPageContent } from '../lib/pages';
import FreeAuditForm from "../../components/FreeAuditForm";
import HeroSlideshow from "../../components/HeroSlideshow";
import AnimatedStats from "../../components/AnimatedStats";
import WhyChooseUsSection from "../../components/WhyChooseUsSection"
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Skytech Ghana - Website & Mobile App Developers",
  description:
    "Skytech Ghana builds websites and mobile apps for businesses. Simple, clear, and focused on results.",
};

const stats = [
  { label: "Projects delivered", value: "180+" },
  { label: "Avg. faster to MVP", value: "3x" },
  { label: "Client NPS", value: "72" },
  { label: "System Uptime", value: "99.9%" },
  { label: "Active Tech Stacks", value: "12+" },
  { label: "Support Response", value: "<15m" },
];

const blogPosts = [
  {
    title: "Why Core Web Vitals are the New SEO Standard",
    category: "SEO",
    excerpt: "Learn how to optimize for speed, stability, and responsiveness to rank higher.",
  },
  {
    title: "The Rise of Progressive Web Apps in Africa",
    category: "Technology",
    excerpt: "Why PWAs are the perfect solution for markets with varying internet connectivity.",
  },
  {
    title: "Mastering Color Theory in Modern Web Design",
    category: "Design",
    excerpt: "How to use color to evoke emotion and establish brand identity.",
  },
];

const faqsPreview = [
  {
    question: "How long does a typical project take?",
    answer: "A Basic Website usually takes 3-8 weeks, while complex apps can take 3-6 months.",
  },
  {
    question: "Do you offer post-launch support?",
    answer: "Yes, we provide 1 to 6 months of dedicated support depending on your package.",
  },
  {
    question: "Do I own the source code?",
    answer: "Absolutely. Once final payment is made, you own full IP rights to all custom work.",
  },
  {
    question: "Can we start with a small MVP?",
    answer: "Yes, we specialize in helping startups launch fast with focused, scalable products.",
  },
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
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-screen flex items-center">
        {/* Background Slideshow */}
        <HeroSlideshow />

        <div className="section-shell relative space-y-16 pt-20">
          <div className="space-y-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                Precision • Performance • Growth
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent">
              Architecting High-Performance Digital Solutions.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-medium">
              We engineer scalable software and high-impact digital experiences that drive measurable business results.
            </p>

            <div className="flex flex-wrap gap-6 pt-6">
              <Link href="/site/contact" className="btn-primary px-10 py-5 text-base font-bold rounded-full shadow-2xl shadow-blue-600/30">
                Start Your Project
              </Link>
              <Link href="/site/pricing" className="btn-secondary border-white/10 text-white/80 hover:text-white hover:bg-white/10 px-10 py-5 text-base font-bold rounded-full backdrop-blur-md transition-all">
                View Rate Card
              </Link>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center lg:justify-start px-4">
            <div className="animate-bounce text-white/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Bar */}
      <AnimatedStats stats={stats} />

      {/* Affiliate network (trust first) */}
      {allPartners.length ? (
        <section className="bg-slate-950 text-white py-14 border-t border-white/5">
          <div className="section-shell space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <span className="pill bg-white/10 text-white border border-white/10 text-[10px] uppercase tracking-widest">
                  Affiliate network
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white/90">
                  Trusted by top teams
                </h2>
              </div>
              <Link
                href="/site/contact"
                className="text-sm font-bold text-white/60 hover:text-white transition-colors"
              >
                Become a partner →
              </Link>
            </div>

            <LogoMarquee partners={allPartners} />
          </div>
        </section>
      ) : null}

      {/* Why Skytech (Atlas Style) */}
      <WhyChooseUsSection />

      {/* Capabilities (Services) */}
      {services?.length ? (
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="section-shell space-y-12">
            {/* Centered Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-widest text-[10px] font-black">Capabilities</span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                {homeContent.servicesSectionTitle || "Engineering the digital products of tomorrow."}
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
                {homeContent.servicesSubtitle || "From high-performance architecture to forensic product optimization, we build systems that scale."}
              </p>
            </div>

            {/* Capabilities Grid (Perfect Four) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.slice(0, 4).map((service) => (
                <div
                  key={service.id}
                  className="group relative rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col items-center text-center"
                >
                  {/* Icon Area */}
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <div className="w-7 h-7">
                      {service.title.toLowerCase().includes('web') ? (
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      ) : service.title.toLowerCase().includes('mobile') ? (
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed min-h-[60px]">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 w-full flex justify-center">
                    <Link href={`/site/services#${service.id}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:gap-3 transition-all">
                      View Architecture
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-bold transition-all hover:bg-blue-600 active:scale-95 shadow-xl shadow-slate-900/10" href="/site/services">
                Explore All Capabilities
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Gallery Bento Grid */}
      <section className="py-24 bg-slate-50">
        <div className="section-shell space-y-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="pill">Portfolio</span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
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
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center text-slate-800 font-black text-2xl uppercase tracking-[0.2em] -rotate-12 opacity-5">Project Featured</div>
              <div className="absolute bottom-0 left-0 right-0 p-10 z-20">
                <span className="pill bg-blue-600 text-white border-none mb-4">Enterprise App</span>
                <h3 className="text-3xl font-black text-white">Advanced Logistics Platform</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-200">
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold text-sm uppercase tracking-widest">E-commerce</div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900/40 to-transparent">
                <h3 className="text-lg font-bold text-white">Modern Retail Site</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-blue-600">
              <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold text-sm uppercase tracking-widest">Web Application</div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900/40 to-transparent">
                <h3 className="text-lg font-bold text-white">Fintech Dashboard</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Blog Preview */}
      {/* Blog Preview (Journal Style) */}
      <section className="py-24 bg-white border-t border-slate-50">
        <div className="section-shell space-y-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-left">
              <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-widest text-[10px] font-black">Latest Insights</span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
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
            {blogPosts.slice(0, 3).map((post, idx) => (
              <Link key={idx} href={`/site/blog/${post.slug || idx}`} className="flex-shrink-0 w-[350px] snap-start group flex items-start gap-5 p-2 rounded-[2.5rem] hover:bg-slate-50 transition-colors duration-300">
                {/* Image Left - Only if it exists */}
                {post.image ? (
                  <div className="flex-shrink-0 w-32 h-24 overflow-hidden rounded-3xl bg-slate-100 border border-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ) : null}

                {/* Content Right */}
                <div className={`space-y-2 pt-1 pr-4 ${!post.image ? 'w-full' : ''}`}>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">INSIGHT</span>
                  <h3 className="text-sm font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    {post.excerpt || post.description}
                  </p>
                </div>
              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* Digital Distinction & Technical Honor */}
      <section className="py-24 bg-white border-t border-slate-50">
        <div className="section-shell space-y-16">
          {/* Top Header Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em]">Engineering Distinction</span>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Recognized for <br />
                <span className="text-blue-600 font-black">Technical</span> Excellence
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
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600/60">{award.category}</span>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
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
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1]">
              Simple Rate Card. <br />
              <span className="text-blue-600">Zero Surprises.</span>
            </h2>
            <p className="text-lg text-slate-600">
              Our pricing is transparent and based on real deliverables. Choose the package that fits your stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1: Basic */}
            <div className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col">
              <div className="space-y-2 mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">3–8 weeks timeline</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Basic Website Package</h3>
                <div className="pt-4 flex items-baseline gap-1">
                  <span className="text-sm font-bold text-slate-400">GHS</span>
                  <span className="text-4xl font-black text-slate-900">2,500</span>
                </div>
              </div>

              <div className="space-y-4 flex-grow">
                <ul className="space-y-3">
                  {["5–6 page modern responsive website", "Basic SEO setup", "WhatsApp chat integration", "1 business email", "Free hosting for 12 months (Bonus)"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Link href="/site/contact" className="w-full inline-flex justify-center items-center px-6 py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Plan 2: Standard */}
            <div className="group relative bg-slate-900 rounded-[2.5rem] border border-blue-600/30 p-10 shadow-2xl shadow-blue-500/10 transition-all duration-500 flex flex-col scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-blue-600/40">
                Most Popular
              </div>
              <div className="space-y-2 mb-8 text-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">2–3 months timeline</span>
                <h3 className="text-2xl font-black text-white tracking-tight">Standard Business Package</h3>
                <div className="pt-4 flex items-baseline gap-1">
                  <span className="text-sm font-bold text-blue-400/50">GHS</span>
                  <span className="text-4xl font-black text-white">6,500</span>
                </div>
              </div>

              <div className="space-y-4 flex-grow">
                <ul className="space-y-3">
                  {["10–12 pages", "Advanced SEO Engine", "Blog with admin access (CMS)", "Security hardening", "Google Business Profile (Bonus)"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-blue-100/70">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Link href="/site/contact" className="w-full inline-flex justify-center items-center px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-white hover:text-slate-900 transition-all">
                  Start Growth
                </Link>
              </div>
            </div>

            {/* Plan 3: E-commerce */}
            <div className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col">
              <div className="space-y-2 mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">3–6 months timeline</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">E-commerce/Booking</h3>
                <div className="pt-4 flex items-baseline gap-1">
                  <span className="text-sm font-bold text-slate-400">GHS</span>
                  <span className="text-4xl font-black text-slate-900">25,000</span>
                </div>
              </div>

              <div className="space-y-4 flex-grow">
                <ul className="space-y-3">
                  {["Full online store / booking system", "Payment integrations (Visa, Momo)", "Stock & coupon management", "Secure admin dashboard", "Advanced SEO + schema"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Link href="/site/contact" className="w-full inline-flex justify-center items-center px-6 py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                  Build Store
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center pt-16">
            <Link href="/site/pricing" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-600 hover:gap-3 transition-all">
              Not what you're looking for? View full catalog
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* FAQ Preview Section (Horizontal Rail) */}
          <div className="pt-24 space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 border-b border-slate-100 pb-8">
              <div className="space-y-4 text-left">
                <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-widest text-[10px] font-black">Support</span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Common Questions</h2>
              </div>
              <Link href="/site/faqs" className="text-blue-600 text-xs font-black uppercase tracking-widest hover:gap-2 flex items-center gap-1 transition-all">
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
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-sm">
                    ?
                  </div>
                  {/* Content Right */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-slate-900 leading-tight">
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
        </div>
      </section>


      {/* CTA Section */}

      {/* Final CTA Section (Surgical Compact) */}
      <section className="py-12 bg-white">
        <div className="section-shell">
          <div className="rounded-[2.5rem] bg-slate-50 border border-slate-100 p-10 lg:p-16 text-center space-y-8">
            <div className="space-y-3 max-w-3xl mx-auto">
              <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-widest text-[9px] font-black">
                Next Steps
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                {homeContent.ctaTitle || "Engineering excellence delivered with precision."}
              </h2>
              <p className="text-base text-slate-500 max-w-2xl mx-auto">
                {homeContent.ctaSubtitle || "Tell us about your project. We'll provide a clear roadmap and the technical power to bring it to life."}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/site/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full font-black text-base hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/15"
              >
                Start Your Project
              </Link>
              <Link
                href="/site/about"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-slate-200 text-slate-900 rounded-full font-black text-base hover:bg-slate-50 transition-all"
              >
                Meet the Team
              </Link>
            </div>
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

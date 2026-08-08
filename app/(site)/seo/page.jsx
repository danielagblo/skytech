import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "SEO Services - Skytech Ghana",
  description: "Rank higher on Google and convert more visitors into customers with our expert SEO services.",
};

export default function SEOPage() {
  return (
    <main className="overflow-x-hidden bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 pt-28 pb-28 text-white md:pb-36">
        <Image
          src="/images/images/BlogPageHeader.png"
          alt="SEO Services"
          fill
          className="absolute inset-0 object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-brand-600/40 blur-[120px]" />

        <div className="section-shell relative">
          <div className="max-w-2xl">
            <span className="pill">Search Engine Optimization</span>
            <h1 className="font-display mt-5 text-4xl font-semibold uppercase leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              Rank Higher on Google.
              <span className="block text-brand-400">Get More Customers.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              We help your website appear on the first page of Google so people can find
              your business. Our SEO services bring you more traffic, leads, and sales.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary px-8 py-4 text-base">
                Book a Free Consultation
              </Link>
              <Link href="#process" className="btn-secondary px-8 py-4 text-base">
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Results */}
      <section className="relative z-10 bg-slate-50 px-6 pb-16 md:pb-20">
        <div className="section-shell md:-mt-32 md:rounded-none md:border md:border-slate-200 md:bg-white md:p-10 md:shadow-lift">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {seoStats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="font-display text-4xl font-semibold text-brand-600 md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">
                  {stat.label}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SEO Section */}
      <section className="py-20 md:py-24" id="process">
        <div className="section-shell">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="section-tag">Why SEO</span>
              <h2 className="section-title mt-4 text-left text-3xl sm:text-4xl lg:text-5xl">
                Why SEO matters for your business.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                Paid ads stop working the moment you stop paying. SEO keeps bringing you
                customers for months and years to come — it is the single highest-ROI
                channel a growing business can invest in.
              </p>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-100 bg-brand-50 text-brand-600">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="font-medium text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {features.map((feature, idx) => (
                <FeatureCard key={feature.title} {...feature} idx={idx} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-slate-50 py-20 md:py-24">
        <div className="section-shell">
          <div className="mb-14 flex flex-col items-center text-center">
            <span className="section-tag justify-center">Our Process</span>
            <h2 className="section-title mt-4 max-w-2xl text-balance">
              How we take you from invisible to page one
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, idx) => (
              <div
                key={step.title}
                className="relative rounded-none border border-slate-100 bg-white p-8 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-none bg-slate-950 font-display text-base font-semibold text-white">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-slate-950 py-20 text-white">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -bottom-20 right-1/4 h-72 w-72 rounded-full bg-brand-600/40 blur-[120px]" />

        <div className="section-shell relative flex flex-col items-center text-center">
          <span className="pill">Get Started</span>
          <h2 className="font-display mt-5 max-w-3xl text-4xl font-semibold uppercase leading-[1.1] text-white sm:text-5xl">
            Ready to own the first page of Google?
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            Tell us about your business and we&apos;ll map out a custom SEO roadmap that
            brings measurable traffic, leads, and revenue to your doorstep.
          </p>
          <Link href="/contact" className="btn-primary mt-8 px-10 py-4 text-lg">
            Talk to Our SEO Team
          </Link>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, desc, icon, idx }) {
  return (
    <div
      className={`glass-panel space-y-4 rounded-none border-slate-100 bg-white p-8 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift ${
        idx % 2 === 1 ? "sm:mt-8" : ""
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-none bg-brand-600/10 text-brand-600">
        {icon}
      </div>
      <h3 className="font-display text-xl font-semibold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{desc}</p>
    </div>
  );
}

const seoStats = [
  { value: "320%", label: "Avg. Traffic Increase", detail: "Within first 6 months" },
  { value: "14x", label: "Better ROI", detail: "Compared to traditional ads" },
  { value: "92%", label: "Search Visibility", detail: "For primary target keywords" },
];

const benefits = [
  "Lower cost-per-lead over time",
  "Establishes long-term brand authority",
  "Captures high-intent search traffic",
  "Works 24/7, even while you sleep",
  "Sustainable growth without ad dependency",
];

const features = [
  {
    title: "On-Page SEO",
    desc: "Optimizing every element of your site for Google's crawlers — titles, meta, structure, and internal links.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Technical SEO",
    desc: "Core Web Vitals, mobile-readiness, site speed, and a clean architecture that crawlers love.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Authority & Backlinks",
    desc: "High-quality backlinks from reputable industry sources that build trust and domain strength.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "Content Strategy",
    desc: "Strategic blog posts and pages that answer your customers' questions and capture demand.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
];

const processSteps = [
  {
    title: "Audit & Research",
    description: "We deep-dive your site, your competitors, and your market to find the keywords and quick wins that matter most.",
  },
  {
    title: "Optimize & Fix",
    description: "We fix technical blockers, sharpen on-page elements, and improve speed and mobile experience.",
  },
  {
    title: "Build Authority",
    description: "We publish content and earn quality backlinks that grow your domain's trust and relevance.",
  },
  {
    title: "Track & Grow",
    description: "Monthly reporting and continuous refinement keep rankings climbing and leads flowing.",
  },
];

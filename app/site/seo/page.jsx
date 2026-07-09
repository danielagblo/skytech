import Link from "next/link";
import FreeAuditForm from "../../../components/FreeAuditForm";

export const metadata = {
  title: "SEO Services - Skytech Ghana",
  description: "Rank higher on Google and convert more visitors into customers with our expert SEO services.",
};

export default function SEOPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-100/30 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />
          </div>
        </div>

        <div className="section-shell text-center space-y-8">
          <span className="pill">Search Engine Optimization</span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Rank Higher on Google. <br />
            <span className="text-blue-600">Get More Customers.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We help your website appear on the first page of Google so people can find your business. Our SEO services bring you more traffic, leads, and sales.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/site/contact" className="btn-primary px-10 py-4 text-lg">Get Your Free SEO Audit</Link>
            <Link href="#process" className="btn-secondary px-10 py-4 text-lg">How It Works</Link>
          </div>
        </div>
      </section>

      {/* Stats / Results */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="section-shell grid grid-cols-1 md:grid-cols-3 gap-12">
            {seoStats.map((stat, idx) => (
                <div key={idx} className="text-center space-y-2">
                    <p className="text-5xl font-black text-blue-600">{stat.value}</p>
                    <p className="text-slate-900 font-black uppercase tracking-[0.2em] text-[10px]">{stat.label}</p>
                    <p className="text-slate-500 text-xs font-medium">{stat.detail}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Why SEO Section */}
      <section className="py-24 bg-white" id="process">
        <div className="section-shell space-y-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                    <h2 className="text-4xl font-black text-slate-900 leading-tight">
                        Why SEO matters for your business.
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Paid ads stop working the moment you stop paying. SEO keeps bringing you customers for months and years to come.
                    </p>
                    <ul className="space-y-4">
                        {benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-4">
                                <div className="mt-1 h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-slate-700 font-semibold">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <FeatureCard 
                            title="On-Page" 
                            desc="Optimizing every element of your site for Google's crawlers."
                            icon="📄"
                        />
                        <FeatureCard 
                            title="Technical" 
                            desc="Speed, mobile-readiness, and clean architecture."
                            icon="⚙️"
                        />
                    </div>
                    <div className="space-y-6 pt-12">
                        <FeatureCard 
                            title="Authority" 
                            desc="High-quality backlinks from reputable industry sources."
                            icon="🛡️"
                        />
                        <FeatureCard 
                            title="Content" 
                            desc="Strategic blog posts that answer your customers' questions."
                            icon="✍️"
                        />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Audit Tool Section */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="absolute inset-0 bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="section-shell relative">
          <div className="max-w-5xl mx-auto rounded-[3rem] border border-slate-200 bg-white shadow-2xl p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 text-left">
                <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-[0.2em] text-[10px] font-black">Free Performance Audit</span>
                <h2 className="text-4xl font-black text-slate-900 leading-tight">
                  Get a Free SEO Audit. <br /> See How Your Site Ranks.
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                  We'll check your site's speed, SEO setup, and find quick wins to help you rank higher on Google.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {['Core Web Vitals', 'On‑page SEO', 'Conversion Fixes', 'Quick Wins'].map(tag => (
                    <div key={tag} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <FreeAuditForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, desc, icon }) {
    return (
        <div className="glass-panel p-8 rounded-3xl space-y-4 border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="text-4xl">{icon}</div>
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
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

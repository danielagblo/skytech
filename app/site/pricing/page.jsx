import PDFViewer from "../../../components/PDFViewer";
import Link from "next/link";

export const metadata = {
  title: "Investment Tiers & Strategy | Skytech Ghana",
  description: "Transparent, value-based pricing architectures for high-performance web and mobile solutions.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section (The Investment Manifesto) */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-32 pb-24 px-4 border-b border-white/5">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute -left-10 top-0 h-[500px] w-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-[500px] w-[500px] bg-cyan-400/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
        </div>
        
        <div className="section-shell relative space-y-10">
          <span className="pill border-blue-600/20 text-blue-400 bg-blue-600/10 uppercase tracking-[0.2em] text-[10px] font-black">Investment Guide</span>
          <div className="max-w-4xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
              Transparent Pricing. <br />
              <span className="text-blue-600 font-black">Zero Surprises.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-2xl">
              We provide fixed-price engineering solutions and dedicated team models designed for long-term scalability and radical transparency.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Grid (The Rate Card) */}
      <section className="py-24 bg-white">
        <div className="section-shell space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div 
                key={pkg.name} 
                className={`group relative p-10 rounded-[2.5rem] border transition-all duration-500 flex flex-col ${
                  pkg.featured 
                    ? "bg-slate-950 text-white border-blue-600/30 shadow-2xl shadow-blue-600/10 scale-105 z-10" 
                    : "bg-slate-50 border-slate-100 hover:bg-white hover:shadow-2xl"
                }`}
              >
                {pkg.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-blue-600/40">
                    Most Popular Architecture
                  </div>
                )}
                
                <div className="space-y-2 mb-8">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${pkg.featured ? "text-blue-400" : "text-blue-600"}`}>
                    {pkg.timeline} Timeline
                  </span>
                  <h3 className="text-2xl font-black tracking-tight">{pkg.name}</h3>
                  <div className="pt-4 flex items-baseline gap-1">
                    <span className={`text-sm font-bold ${pkg.featured ? "text-blue-400/50" : "text-slate-400"}`}>GHS</span>
                    <span className="text-4xl font-black tracking-tighter">{pkg.price}</span>
                  </div>
                </div>

                <div className="space-y-6 flex-grow">
                   <p className={`text-xs font-black uppercase tracking-widest ${pkg.featured ? "text-slate-400" : "text-slate-500"}`}>Technical Deliverables</p>
                   <ul className="space-y-4">
                      {pkg.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm font-medium">
                          <svg className={`w-4 h-4 flex-shrink-0 ${pkg.featured ? "text-blue-400" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className={pkg.featured ? "text-slate-300" : "text-slate-600"}>{item}</span>
                        </li>
                      ))}
                   </ul>
                </div>

                <div className="mt-10">
                  <Link 
                    href="/site/contact" 
                    className={`w-full inline-flex justify-center items-center px-6 py-4 rounded-2xl font-black text-sm transition-all ${
                      pkg.featured 
                        ? "bg-blue-600 text-white hover:bg-white hover:text-slate-900" 
                        : "bg-slate-900 text-white hover:bg-blue-600"
                    }`}
                  >
                    Initiate Project
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Expert Resource (The Prospectus) */}
          <div className="rounded-[3rem] border border-slate-100 bg-slate-50 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4 text-center md:text-left">
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em]">Technical Deep-Dive</span>
              <h2 className="text-3xl font-black text-slate-900">Download the Full Prospectus.</h2>
              <p className="text-slate-500 max-w-xl leading-relaxed">
                Need a granular breakdown of our methodologies, security protocols, and long-term support plans? Access our interactive 2024 pricing and strategy guide.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-6">
              <PDFViewer src="/static/pricing.pdf" label="Open Detailed Strategy Guide" />
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                Secure PDF • 2.4 MB • Updated May 2024
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Values */}
      <section className="py-24 bg-white border-t border-slate-50">
        <div className="section-shell">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Transparent Line-Items", desc: "No hidden costs. Every quote includes engineering, QA, and initial infrastructure deployment." },
              { title: "ROI-Centric Pricing", desc: "We price based on the technical complexity and the measurable business impact of the solution." },
              { title: "Architectural Scalability", desc: "Our models are designed to grow. Scale your investment as your product moves from MVP to Enterprise." }
            ].map(item => (
              <div key={item.title} className="space-y-4">
                <div className="h-1 w-12 bg-blue-600" />
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const packages = [
  {
    name: "Standard Business Architecture",
    timeline: "3–8 Weeks",
    price: "2,500",
    featured: false,
    highlights: [
      "Modern Responsive System Architecture",
      "Advanced SEO Infrastructure",
      "WhatsApp & Real-time Integration",
      "Secured Cloud Hosting (12 Months)",
      "Technical Maintenance Pipeline"
    ]
  },
  {
    name: "Advanced Growth Platform",
    timeline: "2–3 Months",
    price: "6,500",
    featured: true,
    highlights: [
      "10–12 Page High-Performance System",
      "Enterprise SEO Engine & Strategy",
      "Proprietary CMS Integration",
      "Rigorous Security Hardening",
      "Global Search Visibility Audit"
    ]
  },
  {
    name: "Enterprise Digital Ecosystem",
    timeline: "3–6 Months",
    price: "25,000",
    featured: false,
    highlights: [
      "Headless Commerce / Booking Hub",
      "Multi-Gateway Payment Protocols",
      "Forensic Stock & API Management",
      "Secure Admin Technical Dashboard",
      "Global Schema & Data Optimization"
    ]
  }
];

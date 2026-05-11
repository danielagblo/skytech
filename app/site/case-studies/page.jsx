import Link from "next/link";

export const metadata = {
  title: "Case Studies | Skytech Ghana Portfolio",
  description: "Real results for real brands. Explore our high-performance digital architecture and mobile solutions.",
};

const caseStudies = [
  {
    title: "Global Logistics Redesign",
    category: "Web Application",
    client: "TransitLine",
    impact: "40% faster booking",
    color: "bg-blue-600"
  },
  {
    title: "Fintech Mobile Wallet",
    category: "Mobile App",
    client: "PaySwift",
    impact: "1.2M users at launch",
    color: "bg-slate-900"
  },
  {
    title: "E-commerce Growth Engine",
    category: "Growth & SEO",
    client: "ModaStyle",
    impact: "+210% organic revenue",
    color: "bg-indigo-700"
  },
  {
    title: "Healthcare Portal",
    category: "Enterprise System",
    client: "HealthFirst",
    impact: "HIPAA Compliant Architecture",
    color: "bg-cyan-600"
  }
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="section-shell space-y-16">
        <div className="space-y-6">
          <span className="pill">Our Portfolio</span>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-[1.1]">
            Engineering results, <br /> not just code.
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
            A selection of projects where we combined elite engineering with measurable business impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {caseStudies.map((study) => (
            <div key={study.title} className="group cursor-pointer">
              <div className={`aspect-[16/10] rounded-[2.5rem] ${study.color} mb-8 relative overflow-hidden transition-transform duration-500 group-hover:scale-[0.98]`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-10 left-10 text-white space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{study.category}</p>
                   <h3 className="text-3xl font-black">{study.title}</h3>
                </div>
              </div>
              <div className="flex items-start justify-between px-4">
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-blue-600">{study.client}</p>
                  <p className="text-lg font-bold text-slate-900">{study.impact}</p>
                </div>
                <div className="h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                   <svg className="w-5 h-5 text-slate-900 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                   </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

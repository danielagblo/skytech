import Link from "next/link";

export const metadata = {
  title: "Case Studies | Skytech Ghana Portfolio",
  description: "Real results for real brands. Explore our high-performance digital architecture and mobile solutions.",
};

const caseStudies = [
  {
    title: "CRM Enterprise Software",
    category: "Sales Architecture",
    client: "Internal Deployment",
    impact: "Automated Lead Velocity",
    desc: "A robust sales management platform featuring a drag-and-drop Kanban architecture, automated commission tracking, and real-time performance analytics.",
    metrics: ["Next.js", "Prisma ORM", "PostgreSQL"],
    image: "/images/hero-1.png"
  },
  {
    title: "Atlas Rent-a-Car System",
    category: "Cloud & Booking Engines",
    client: "Atlas Rent-A-Car",
    impact: "Forensic Branch Orchestration",
    desc: "A comprehensive car rental ecosystem utilizing AWS S3 for advanced asset optimization and a secure PostgreSQL backend for real-time booking management.",
    metrics: ["AWS S3 Integration", "TypeScript", "PostgreSQL"],
    image: "/images/hero-2.png"
  },
  {
    title: "Oysloe Classifieds Ecosystem",
    category: "Mobile-First SaaS",
    client: "Oysloe Global",
    impact: "Automated Subscription Velocity",
    desc: "A multi-platform classifieds ecosystem featuring automated Arkesel SMS notifications, Firebase push notifications, and high-performance media delivery.",
    metrics: ["Django REST", "Flutter", "Arkesel SMS"],
    image: "/images/hero-3.png"
  },
  {
    title: "Perseverance Real Estate",
    category: "Property Discovery",
    client: "P.I.G. Estate",
    impact: "Advanced Search Logic",
    desc: "A high-authority property discovery platform featuring complex search filters, Prisma-powered data relations, and an integrated administrative dashboard.",
    metrics: ["Next.js", "Prisma", "Tailwind CSS"],
    image: "/images/hero-1.png"
  },
  {
    title: "EKG Fleet & Commerce",
    category: "E-commerce & Logistics",
    client: "EKG Solutions",
    impact: "Dual-Purpose Revenue Stream",
    desc: "A unique hybrid platform managing both product sales and vehicle fleet rentals with secure user transaction history and automated notifications.",
    metrics: ["Next.js", "JWT Auth", "Nodemailer"],
    image: "/images/hero-2.png"
  },
  {
    title: "Food Logistics System",
    category: "Logistics Engineering",
    client: "QuickDelivery",
    impact: "Real-time Order Orchestration",
    desc: "A specialized logistics tool featuring real-time cart synchronization and a streamlined delivery tracking interface for high-velocity ordering.",
    metrics: ["TypeScript", "Next.js", "React"],
    image: "/images/hero-3.png"
  },
  {
    title: "BestLand Marketing Suite",
    category: "Marketing Architecture",
    client: "BestLand Properties",
    impact: "Production-Ready Conversion",
    desc: "A high-performance real estate landing page and management suite featuring specialized 'Inky' editorial design and pricing logic.",
    metrics: ["Next.js", "Vercel", "Inky UI"],
    image: "/images/hero-1.png"
  },
  {
    title: "Accord Professional CMS",
    category: "Corporate Identity",
    client: "Accord Services",
    impact: "Custom Editorial Control",
    desc: "A corporate identity portal with a custom-built Django CMS for managing professional service descriptions and vision blocks.",
    metrics: ["Python (Django)", "SQLite", "Bootstrap"],
    image: "/images/hero-2.png"
  },
  {
    title: "Oysloe Upgrade API",
    category: "API Infrastructure",
    client: "Oysloe Global",
    impact: "Scalable Endpoint Logic",
    desc: "A modernized RESTful backend featuring subscription activation logic and a versioned API architecture to support multi-platform client types.",
    metrics: ["Django REST", "PostgreSQL", "Versioned API"],
    image: "/images/hero-3.png"
  },
  {
    title: "Legacy School Management",
    category: "Administrative Workflow",
    client: "Local Education",
    impact: "Institutional Record Integrity",
    desc: "A desktop-grade educational management tool for local infrastructure deployments, focusing on student records and administrative workflows.",
    metrics: ["C#", ".NET", "Local DB"],
    image: "/images/hero-1.png"
  }
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="section-shell space-y-32">
        {/* Header Block */}
        <div className="max-w-4xl space-y-6">
          <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-[0.2em] text-[10px] font-black">Proven Architectures</span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Engineering results, <br />
            <span className="text-blue-600">not just features.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed font-medium">
            A forensic selection of technical deployments where we combined elite engineering with measurable business impact.
          </p>
        </div>

        {/* Impact List */}
        <div className="space-y-40">
          {caseStudies.map((study, idx) => (
            <div key={study.title} className={`flex flex-col lg:flex-row gap-16 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Visual Spotlight */}
              <div className="w-full lg:w-1/2 group relative">
                <div className="aspect-[16/10] rounded-[3rem] bg-slate-50 border border-slate-100 overflow-hidden relative shadow-2xl shadow-blue-600/5">
                   <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-colors z-10" />
                   <div className="w-full h-full flex items-center justify-center text-slate-200 font-black text-2xl uppercase tracking-[0.2em] -rotate-12">
                      Technical Blueprint
                   </div>
                </div>
                {/* Impact Chip */}
                <div className="absolute -bottom-6 -right-6 lg:right-auto lg:-left-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 z-20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Impact Result</p>
                    <p className="text-xl font-black text-slate-900">{study.impact}</p>
                </div>
              </div>

              {/* Technical Narrative */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{study.category}</span>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">{study.title}</h3>
                  <p className="text-lg text-slate-500 leading-relaxed font-medium">
                    {study.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                   {study.metrics.map(metric => (
                     <span key={metric} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600">
                        {metric}
                     </span>
                   ))}
                </div>

                <div className="pt-6">
                  <Link href="/site/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
                    View Technical Specs
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA */}
        <div className="rounded-[4rem] bg-slate-950 p-16 md:p-24 text-center space-y-10 relative overflow-hidden">
           <div className="absolute inset-0 bg-blue-600/10 blur-[120px]" />
           <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
              <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">Future Proofing</span>
              <h2 className="text-4xl md:text-6xl font-black text-white">Your architecture <br /> is next.</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Join the brands that prioritized technical integrity and measurable growth. Let's build your technical legacy.
              </p>
           </div>
           <div className="relative z-10">
              <Link href="/site/contact" className="inline-flex items-center gap-3 px-12 py-6 bg-blue-600 text-white rounded-full font-black text-lg hover:bg-white hover:text-slate-950 transition-all shadow-2xl shadow-blue-600/20">
                Start Technical Audit
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}

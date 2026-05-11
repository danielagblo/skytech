export const metadata = {
  title: 'Engineering Authority - About Skytech Ghana',
  description: "Meet the specialized engineering collective architecting high-performance digital foundations for Ghana's most ambitious brands.",
};

import { getPageContent } from '../../lib/pages';

export const dynamic = 'force-dynamic';

export default async function About() {
  const pages = await getPageContent();
  const aboutContent = pages.about || {};
  return (
    <main className="min-h-screen">
      {/* Hero Section (The Manifesto) */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-32 px-4">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute -left-10 top-0 h-[500px] w-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-[500px] w-[500px] bg-cyan-400/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
        </div>
        
        <div className="section-shell relative space-y-10">
          <span className="pill border-blue-600/20 text-blue-400 bg-blue-600/10 uppercase tracking-[0.2em] text-[10px] font-black">Our Narrative</span>
          <div className="max-w-4xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
              {aboutContent.heroTitle || "Engineering the digital foundations of future-proof business."}
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-medium">
              {aboutContent.heroSubtitle || "We are a specialized engineering collective. We prioritize technical precision and predictable transparency over corporate bloat."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/5">
            {aboutStats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section (The Skytech Standard) */}
      <section className="py-24 bg-white">
        <div className="section-shell grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em]">Our Philosophy</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                {aboutContent.missionTitle || "Architectural Precision as a Standard."}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {aboutContent.missionSubtitle || "We don't just 'build websites.' We architect high-performance digital ecosystems. Every line of code we write is a deliberate decision aimed at scalability, security, and real-world results."}
              </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {missionPoints.map((point) => (
                <li key={point} className="flex items-center gap-4 text-sm font-bold text-slate-800">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative p-12 rounded-[3rem] bg-slate-950 text-white shadow-2xl overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10 space-y-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">The Methodology</p>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-lg font-black">Predictable Deployment</p>
                    <p className="text-sm text-slate-400 leading-relaxed italic">"No surprises. We use structured staging environments and automated testing to ensure every release is a victory."</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-black">Bank-Grade Stability</p>
                    <p className="text-sm text-slate-400 leading-relaxed italic">"We build for the worst-case scenario. Our architectures are hardened against failure, ensuring your business stays online 24/7."</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-black">Radial Transparency</p>
                    <p className="text-sm text-slate-400 leading-relaxed italic">"Direct access to our lead engineers. You see what we see, from code commits to project velocity."</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* The Principles (Bento Grid) */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="section-shell space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="pill bg-white border-slate-200 text-slate-500 uppercase tracking-widest text-[9px] font-black">The Skytech DNA</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">How We Think.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-2xl transition-all duration-500">
                <div className="mb-6 text-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                  {value.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Timeline */}
      <section className="py-24 bg-white">
        <div className="section-shell space-y-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-slate-100 pb-10">
            <div className="space-y-4">
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em]">Our Trajectory</span>
              <h2 className="text-4xl font-black text-slate-900 leading-tight">A Record of Resilience.</h2>
            </div>
            <p className="text-slate-500 max-w-md text-sm leading-relaxed">
              We started with a single server and a commitment to radical transparency. Today, we architect global-scale platforms.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {timeline.map((item) => (
              <div key={item.year} className="group flex flex-col md:flex-row md:items-center gap-6 p-8 rounded-3xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-blue-100 transition-all">
                <span className="text-lg font-black text-blue-600 tracking-tighter">{item.year}</span>
                <div className="space-y-1">
                   <p className="text-slate-900 font-black text-lg">{item.title}</p>
                   <p className="text-sm text-slate-500">{item.detail}</p>
                </div>
                <div className="md:ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="h-2 w-2 rounded-full bg-blue-600 block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team DNA Section */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-blue-600/5 blur-[120px] -translate-x-1/2" />
        <div className="section-shell grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-20 items-center relative z-10">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="pill border-blue-600/20 text-blue-400 bg-blue-600/10 uppercase tracking-[0.2em] text-[10px] font-black">The Human Component</span>
              <h2 className="text-5xl font-black leading-tight">Lean Intelligence. <br /> Predictable Results.</h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                We are a lean collective of engineers, designers, and strategists. You won't find account managers or layers of bureaucracy here—just the people building your future.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {teamTraits.map((trait) => (
                <span key={trait} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-blue-200">
                  {trait}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {teamCards.map((card) => (
              <div key={card.title} className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">{card.title}</p>
                <p className="text-sm text-slate-300 leading-relaxed">{card.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const values = [
  {
    title: 'Architectural Integrity',
    description: 'We prioritize system stability over quick hacks. Every project is built to withstand scale and security threats.',
    icon: '🏗️'
  },
  {
    title: 'Radical Transparency',
    description: 'Direct communication with the engineers building your product. No filters, no fluff, just technical honesty.',
    icon: '👁️'
  },
  {
    title: 'Precision Execution',
    description: 'We use structured methodologies and automated testing to ensure every deployment is predictable and safe.',
    icon: '⚡'
  }
];

const aboutStats = [
  { label: 'Architectures Deployed', value: '180+' },
  { label: 'Lead Engineers', value: '14' },
  { label: 'Industries Modernized', value: '8' },
];

const missionPoints = [
  'Technically rigorous planning',
  'Code-first progress updates',
  'Long-term engineering support',
  'Bank-grade security standards',
];

const timeline = [
  { year: '2020', title: 'The Foundation', detail: 'Skytech launched with a mission to modernize West Africa’s digital landscape.' },
  { year: '2021', title: 'Mobile Innovation', detail: 'Pioneered secure, high-performance cross-platform mobile architectures.' },
  { year: '2023', title: 'System Expansion', detail: 'Developed proprietary tools for rapid, secure enterprise deployments.' },
  { year: '2024', title: 'Global Authority', detail: 'Recognized as the premier technical partner for cross-border digital platforms.' },
];

const teamTraits = ['Engineering-Led', 'Direct Communcation', 'Radical Integrity', 'Performance-Obsessed'];

const teamCards = [
  { title: 'Engineer-Led Sales', copy: 'Your first call is with a technical lead, not a salesperson. We talk feasibility from day one.' },
  { title: 'Transparent Velocity', copy: 'We share real-time progress through staging environments and technical documentation.' },
  { title: 'Quality Assurance', copy: 'Automated testing and rigorous peer reviews are baked into our deployment pipeline.' },
  { title: 'Knowledge Transfer', copy: 'We ensure your team is equipped to manage the systems we build through thorough handovers.' },
];

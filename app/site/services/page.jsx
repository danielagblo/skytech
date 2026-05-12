import dbConnect from '../../lib/mongodb';
import ServiceModel from '../../models/Service';
import { getPageContent } from '../../lib/pages';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Strategic Engineering Services - Skytech Ghana',
  description: "Architecting high-performance digital ecosystems, enterprise-grade mobile applications, and secure fintech infrastructures for global brands.",
};

async function getServices() {
  try {
    await dbConnect();
    return await ServiceModel.find({}).lean();
  } catch (error) {
    console.error('Failed to fetch services from MongoDB:', error);
    return [];
  }
}

export default async function Services() {
  const services = await getServices();
  const pages = await getPageContent();
  const servicesContent = pages.services || {};
  return (
    <main className="min-h-screen">
      {/* Hero Section (The Capability Statement) */}
      <section className="relative overflow-hidden bg-white text-slate-900 py-32 px-4 border-b border-slate-100">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute left-10 -top-10 h-[500px] w-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-[500px] w-[500px] bg-cyan-400/5 rounded-full blur-[120px]" />
        </div>
        
        <div className="section-shell relative space-y-10">
          <span className="pill border-blue-600/20 text-blue-600 bg-blue-50 uppercase tracking-[0.2em] text-[10px] font-black">Our Capabilities</span>
          <div className="max-w-4xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
              {servicesContent.heroTitle || "Engineering high-performance digital ecosystems."}
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium">
              {servicesContent.heroSubtitle || "We architect, deploy, and scale. Our engineering standards prioritize bank-grade security and native performance across every platform."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
            {capabilities.map((cap) => (
              <span key={cap} className="px-5 py-2 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600">
                {cap}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Verticals (Who We Serve) */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="section-shell space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em]">Strategic Verticals</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Industries We Modernize.</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We specialize in sectors that demand technical rigor, high availability, and absolute data integrity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whoWeWorkFor.map((item) => (
              <div key={item.name} className="group p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
                <div className="mb-6 w-12 h-12 rounded-xl bg-blue-600/5 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3">{item.name}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                  {item.types.map((type) => (
                    <span key={type} className="text-[9px] font-black uppercase tracking-widest text-blue-600/60">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Architectures (The Grid) */}
      <section className="py-24 bg-slate-50">
        <div className="section-shell space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="pill bg-white border-slate-200 text-slate-500 uppercase tracking-widest text-[9px] font-black">Our Service Stack</span>
            <h2 className="text-4xl font-black text-slate-900 leading-tight">{servicesContent.whatWeDoTitle || "Full-Lifecycle Engineering."}</h2>
            <p className="text-lg text-slate-600">{servicesContent.whatWeDoSubtitle || "We handle everything from initial system architecture to long-term infrastructure maintenance."}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service.id} className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-start justify-between mb-8">
                  <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all">{service.icon}</span>
                  <span className="h-2 w-2 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-6">{service.description}</p>
                <div className="pt-6 border-t border-slate-50 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
                  <span>View Technical Specs</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Architectures */}
      <section className="py-24 bg-white">
        <div className="section-shell space-y-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 border-b border-slate-100 pb-10">
            <div className="space-y-4">
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em]">Collaboration Models</span>
              <h2 className="text-4xl font-black text-slate-900 leading-tight">{servicesContent.engagementTitle || "Tactical Engagement Models."}</h2>
            </div>
            <p className="text-slate-600 max-w-xl text-sm leading-relaxed">
              We offer structured engagement paths designed to align with your organization's technical velocity and budgetary goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {engagements.map((item) => (
              <div key={item.title} className="group p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all">
                <h3 className="text-xl font-black text-slate-900 mb-4">{item.title}</h3>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed italic">"{item.description}"</p>
                <ul className="space-y-4">
                  {item.items.map((line) => (
                    <li key={line} className="flex items-center gap-3 text-xs font-bold text-slate-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Infrastructure (Tech Stack) */}
      <section className="py-24 bg-slate-50">
        <div className="section-shell space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="pill bg-white border-slate-200 text-slate-500 uppercase tracking-widest text-[9px] font-black">Our Infrastructure</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Tools of the Trade.</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {stack.map((tech) => (
              <div key={tech.name} className="group p-6 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center gap-4 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-500">
                <div className="relative w-10 h-10 transition-all duration-500 group-hover:scale-110">
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className="w-full h-full object-contain transition-all duration-500"
                  />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section (The Lead Path) */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 blur-[120px]" />
        <div className="section-shell relative z-10 text-center space-y-10">
          <div className="space-y-4 max-w-3xl mx-auto">
             <span className="pill border-blue-600/20 text-blue-400 bg-blue-600/10 uppercase tracking-[0.2em] text-[10px] font-black">Start the Process</span>
             <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
               {servicesContent.ctaTitle || "Ready to architect your digital future?"}
             </h2>
             <p className="text-xl text-slate-400 leading-relaxed">
               {servicesContent.ctaSubtitle || "Tell us about your technical challenges. We'll provide a clear blueprint and the engineering power to execute it."}
             </p>
          </div>
          
          <div className="flex justify-center gap-4 flex-wrap pt-6">
            <a href="/site/contact" className="px-10 py-5 bg-blue-600 text-white rounded-full font-black text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
              Technical Consultation
            </a>
            <a href="/site/contact" className="px-10 py-5 border-2 border-white/20 text-white rounded-full font-black text-base hover:bg-white/10 transition-all">
              Request a Proposal
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

const engagements = [
  {
    title: 'Dedicated Engineering Squads',
    description: 'A specialized team of senior engineers deeply integrated into your weekly development cycle.',
    items: ['Direct Lead Communication', 'Agile Velocity Tracking', 'Infrastructure Ownership']
  },
  {
    title: 'Fixed-Scope Technical Delivery',
    description: 'A surgical approach to product development with defined milestones and guaranteed delivery timelines.',
    items: ['Defined Architectural Scope', 'Milestone-Based Releases', 'Hard-Deadline Commitment']
  },
  {
    title: 'Infrastructure & Security Audits',
    description: 'A forensic deep-dive into your existing systems to identify performance bottlenecks and security vulnerabilities.',
    items: ['Performance Stress-Testing', 'Cost Optimization Analysis', 'Hardening & Compliance']
  },
];

const stack = [
  { name: 'Next.js', icon: 'https://skillicons.dev/icons?i=nextjs' },
  { name: 'React', icon: 'https://skillicons.dev/icons?i=react' },
  { name: 'Node.js', icon: 'https://skillicons.dev/icons?i=nodejs' },
  { name: 'TypeScript', icon: 'https://skillicons.dev/icons?i=ts' },
  { name: 'Python', icon: 'https://skillicons.dev/icons?i=py' },
  { name: 'Flutter', icon: 'https://skillicons.dev/icons?i=flutter' },
  { name: 'PostgreSQL', icon: 'https://skillicons.dev/icons?i=postgres' },
  { name: 'MongoDB', icon: 'https://skillicons.dev/icons?i=mongodb' },
  { name: 'AWS', icon: 'https://skillicons.dev/icons?i=aws' },
  { name: 'Azure', icon: 'https://skillicons.dev/icons?i=azure' },
  { name: 'DigitalOcean', icon: '/images/digital oceans.png' },
  { name: 'Kubernetes', icon: 'https://cdn.simpleicons.org/kubernetes/326CE5' },
  { name: 'Docker', icon: 'https://skillicons.dev/icons?i=docker' },
  { name: 'Terraform', icon: 'https://skillicons.dev/icons?i=terraform' },
  { name: 'Kafka', icon: 'https://skillicons.dev/icons?i=kafka' },
  { name: 'Linode', icon: '/images/linode.png' },
  { name: 'Railway', icon: 'https://cdn.simpleicons.org/railway/131415' },
  { name: 'GitHub', icon: 'https://skillicons.dev/icons?i=github' },
  { name: 'Arkesel', icon: '/images/arkesel.png' },
  { name: 'Lexical', icon: 'https://lexical.dev/img/logo.svg' },
];

const capabilities = ['Enterprise Architectures', 'Native Performance Apps', 'Cloud Infrastructure', 'Data Engineering', 'Product Strategy'];

const whoWeWorkFor = [
  {
    name: 'Enterprise SaaS',
    description: 'Scalable cloud platforms and multi-tenant software systems.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
  {
    name: 'Modern E-commerce',
    description: 'High-conversion marketplaces and headless commerce solutions.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
  {
    name: 'Fintech & Payments',
    description: 'Secure transaction processing and financial data architectures.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
  {
    name: 'HealthTech',
    description: 'Privacy-compliant medical platforms and diagnostic tools.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
  {
    name: 'Logistics & Fleet',
    description: 'Real-time tracking systems and supply chain automation.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
  {
    name: 'PropTech',
    description: 'Advanced real estate management and listing platforms.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
  {
    name: 'Enterprise Internal',
    description: 'High-performance internal tools and workflow automation.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    types: ['Web']
  },
  {
    name: 'EdTech',
    description: 'LMS platforms and interactive learning ecosystems.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    types: ['Web', 'Mobile']
  },
];

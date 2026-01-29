/* eslint-disable react-refresh/only-export-components */
import Link from 'next/link';
import { fetchServices } from '../../../utils/api';

export const metadata = {
  title: 'Services - SkyTech Software Solutions',
  description: "Explore SkyTech's comprehensive software development services including web development, mobile apps, and cloud solutions.",
};

export default async function Services() {
  const services = await fetchServices();
return (
  <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 px-4">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute left-10 -top-10 h-72 w-72 rounded-full bg-blue-600/40 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl" />
        </div>
        <div className="section-shell relative space-y-6">
          <span className="pill">Services</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-3xl">Product squads for every stage of your roadmap.</h1>
          <p className="text-lg text-white/85 max-w-3xl">From discovery to scale, we assemble cross-functional teams with the right depth in product, design, engineering, and DevOps.</p>
          <div className="flex flex-wrap gap-3 text-sm">
            {capabilities.map((cap) => (
              <span key={cap} className="rounded-full bg-white/10 px-4 py-2 border border-white/15">{cap}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Work For */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-white">
        <div className="section-shell space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="pill">Who we serve</span>
            <h2 className="text-3xl font-extrabold text-white">The businesses we build for</h2>
            <p className="text-white/85">We work with startups, scale-ups, and established companies across industries.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whoWeWorkFor.map((item) => (
              <div key={item.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{item.name}</h3>
                <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.types.map((type) => (
                    <span key={type} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                      <span className="text-xs">{type === 'Web' ? '🌐' : '📱'}</span>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="section-shell space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="pill">What we do</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">End-to-end delivery with accountable ownership.</h2>
            <p className="text-slate-600">Each engagement has a lead, clear milestones, and built-in QA and observability.</p>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {services.map((service) => (
              <div key={service.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm hover:-translate-y-1 transition">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-700">{service.category}</p>
                  <span className="text-2xl">{service.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.name}</h3>
                <p className="text-slate-600 mb-5 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Models */}
      <section className="py-20 bg-slate-50">
        <div className="section-shell space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-3">
              <span className="pill">Engagement models</span>
              <h2 className="text-3xl font-extrabold text-slate-900">Choose how we partner.</h2>
              <p className="text-slate-600 max-w-2xl">Flexible models that match your team’s rhythm and budget.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {engagements.map((item) => (
              <div key={item.title} className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{item.description}</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {item.items.map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-white">
        <div className="section-shell space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <span className="pill">Tech stack</span>
              <h2 className="text-2xl font-extrabold text-slate-900">Battle-tested tools we love.</h2>
            </div>
            <p className="text-slate-600 max-w-xl">We pick the right tools for the problem—not the other way around.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {stack.map((tech) => (
              <span key={tech} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 text-center">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-r from-blue-700 to-blue-500 text-white">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="section-shell relative text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Need a custom solution?</h2>
          <p className="text-lg text-white/85 max-w-2xl mx-auto">Let’s scope your project and build a delivery plan that fits.</p>
            <div className="flex justify-center gap-4 flex-wrap">
            <a href="/site/contact" className="btn-primary bg-white text-blue-700 hover:bg-blue-50 shadow-white/30">Schedule a consultation</a>
            <a href="/site/contact" className="btn-secondary border-white/60 text-white hover:bg-white/10">Share your brief</a>
          </div>
        </div>
      </section>
    </>
  );
}

const engagements = [
  {
    title: 'Embedded squad',
    description: 'Cross-functional team that pairs with your product and engineering leads.',
    items: ['Weekly demos & async updates', 'Flexible scope with clear guardrails', 'Shared rituals and tools']
  },
  {
    title: 'Project-based',
    description: 'Fixed-scope initiatives with defined milestones and delivery dates.',
    items: ['Discovery to launch plan', 'Agreed acceptance criteria', 'Risk register and mitigation']
  },
  {
    title: 'Advisory & audits',
    description: 'Architecture reviews, roadmap shaping, and quality audits.',
    items: ['Architecture & DX audits', 'Performance & cost reviews', 'Security and observability gaps']
  },
];

const stack = ['React / Next.js', 'Node.js', 'TypeScript', 'Python', 'Flutter', 'PostgreSQL', 'MongoDB', 'AWS', 'Azure', 'DigitalOcean', 'Linode', 'Railway', 'Kubernetes', 'Docker', 'Terraform', 'Kafka'];

const capabilities = ['Web', 'Mobile', 'Cloud & DevOps', 'Data & AI', 'Product & UX'];

const whoWeWorkFor = [
  {
    name: 'SaaS & Platforms',
    description: 'B2B and B2C subscription businesses',
    icon: '🚀',
    types: ['Web', 'Mobile']
  },
  {
    name: 'E-Commerce',
    description: 'Retail, marketplaces, and DTC brands',
    icon: '🛍️',
    types: ['Web', 'Mobile']
  },
  {
    name: 'FinTech & Payments',
    description: 'Fintech companies, payment processors',
    icon: '💳',
    types: ['Web', 'Mobile']
  },
  {
    name: 'Healthcare & BioTech',
    description: 'Medical platforms, health tech, biotech',
    icon: '⚕️',
    types: ['Web', 'Mobile']
  },
  {
    name: 'Logistics & Supply Chain',
    description: 'Delivery, tracking, and inventory',
    icon: '📦',
    types: ['Web', 'Mobile']
  },
  {
    name: 'Real Estate & PropTech',
    description: 'Property platforms and management tools',
    icon: '🏠',
    types: ['Web', 'Mobile']
  },
  {
    name: 'Enterprise Software',
    description: 'B2B tools, ERPs, and internal systems',
    icon: '💼',
    types: ['Web']
  },
  {
    name: 'EdTech & Learning',
    description: 'Education platforms and learning management',
    icon: '📚',
    types: ['Web', 'Mobile']
  },
];

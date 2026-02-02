/* eslint-disable react-refresh/only-export-components */
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import resolveSharedData from '../../lib/sharedData';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Services - SkyTech Website & App Development',
  description: "We build websites and mobile apps. Simple, clear, and focused on results.",
};

function getServices() {
  try {
    const filePath = path.join(resolveSharedData(), 'services.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read services:', error);
    return [];
  }
}

export default async function Services() {
  const services = getServices();
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
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-3xl">We build websites and mobile apps.</h1>
          <p className="text-lg text-white/85 max-w-3xl">We plan, design, build, and launch. Then we support you after launch.</p>
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
            <h2 className="text-3xl font-extrabold text-white">Who we help</h2>
            <p className="text-white/85">We help startups and growing businesses.</p>
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
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">We handle the full job.</h2>
            <p className="text-slate-600">You get a clear plan, a simple timeline, and a lead to guide the work.</p>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {services.map((service) => (
              <div key={service.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm hover:-translate-y-1 transition">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
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
              <h2 className="text-3xl font-extrabold text-slate-900">Choose how we work together.</h2>
              <p className="text-slate-600 max-w-2xl">Pick what fits your budget and timeline.</p>
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
              <h2 className="text-2xl font-extrabold text-slate-900">Tools we use</h2>
            </div>
            <p className="text-slate-600 max-w-xl">We choose tools that are reliable and easy to maintain.</p>
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
          <h2 className="text-3xl sm:text-4xl font-extrabold">Need help with a website or app?</h2>
          <p className="text-lg text-white/85 max-w-2xl mx-auto">Tell us what you need. We will guide you step by step.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="/site/contact" className="btn-primary bg-white text-blue-700 hover:bg-blue-50 shadow-white/30">Talk to us</a>
            <a href="/site/contact" className="btn-secondary border-white/60 text-white hover:bg-white/10">Send your idea</a>
          </div>
        </div>
      </section>
    </>
  );
}

const engagements = [
  {
    title: 'Team with you',
    description: 'A small team works with your team every week.',
    items: ['Weekly updates', 'Clear plan', 'Shared tools']
  },
  {
    title: 'Fixed project',
    description: 'We agree on the work and finish by the date.',
    items: ['Clear scope', 'Simple milestones', 'On-time delivery']
  },
  {
    title: 'Review & advice',
    description: 'We check your app and tell you what to improve.',
    items: ['Speed checks', 'Cost checks', 'Security checks']
  },
];

const stack = ['React / Next.js', 'Node.js', 'TypeScript', 'Python', 'Flutter', 'PostgreSQL', 'MongoDB', 'AWS', 'Azure', 'DigitalOcean', 'Linode', 'Railway', 'Kubernetes', 'Docker', 'Terraform', 'Kafka'];

const capabilities = ['Websites', 'Mobile apps', 'Cloud', 'Data', 'Design'];

const whoWeWorkFor = [
  {
    name: 'Software companies',
    description: 'Businesses that sell software',
    icon: '🚀',
    types: ['Web', 'Mobile']
  },
  {
    name: 'Online stores',
    description: 'Shops and marketplaces',
    icon: '🛍️',
    types: ['Web', 'Mobile']
  },
  {
    name: 'Payments',
    description: 'Money and payment apps',
    icon: '💳',
    types: ['Web', 'Mobile']
  },
  {
    name: 'Health',
    description: 'Health and medical platforms',
    icon: '⚕️',
    types: ['Web', 'Mobile']
  },
  {
    name: 'Logistics',
    description: 'Delivery and tracking tools',
    icon: '📦',
    types: ['Web', 'Mobile']
  },
  {
    name: 'Real estate',
    description: 'Property and housing tools',
    icon: '🏠',
    types: ['Web', 'Mobile']
  },
  {
    name: 'Business tools',
    description: 'Internal tools for teams',
    icon: '💼',
    types: ['Web']
  },
  {
    name: 'Education',
    description: 'Learning apps and platforms',
    icon: '📚',
    types: ['Web', 'Mobile']
  },
];

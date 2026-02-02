/* eslint-disable react-refresh/only-export-components */
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import ContactFormClient from '../../../components/ContactFormClient';
import { getSettings } from '../../lib/settings';
import resolveSharedData from '../../lib/sharedData';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact SkyTech - Get In Touch',
  description: 'Contact SkyTech for software development inquiries. Get in touch with our team today.',
};

function getTeam() {
  try {
    const filePath = path.join(resolveSharedData(), 'team.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read team:', error);
    return [];
  }
}

export default async function Contact() {
  const settings = getSettings();
  const teamMembers = getTeam();
  const submitted = false;
  return (
  <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 px-4">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute left-10 -top-10 h-72 w-72 rounded-full bg-blue-600/40 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl" />
        </div>
        <div className="section-shell relative space-y-6">
          <span className="pill">Contact</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-3xl">Tell us what you want to build.</h1>
          <p className="text-lg text-white/85 max-w-3xl">We will reply fast and guide you step by step.</p>
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            <span className="rounded-full bg-white/10 px-4 py-2 border border-white/15">Reply in 24 hours</span>
            <span className="rounded-full bg-white/10 px-4 py-2 border border-white/15">Remote team</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="section-shell">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr,1.1fr] gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-50 border border-slate-100 p-6">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Contact information</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📧</div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">Email</h3>
                      <a href={`mailto:${settings.contactEmail}`} className="text-blue-700 text-sm font-semibold hover:underline">{settings.contactEmail}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📱</div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">Phone</h3>
                      <a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`} className="text-blue-700 text-sm font-semibold hover:underline">{settings.contactPhone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">💬</div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">WhatsApp</h3>
                      <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} className="text-blue-700 text-sm font-semibold hover:underline">{settings.whatsapp}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📍</div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">Address</h3>
                      <p className="text-sm text-slate-600">{settings.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                <iframe
                  title="Bricsky on Google Maps"
                  src="https://maps.google.com/maps?q=Bricsky&output=embed"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="rounded-3xl bg-slate-900 text-white p-6 space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-200">Quick call?</p>
                <p className="text-lg">Book a short call and tell us your idea.</p>
                <p className="text-sm text-white/80">Mon–Fri, 9am–6pm PT</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-panel rounded-3xl p-8">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Tell us about your project</h2>
              <p className="text-sm text-slate-600 mb-6">Share what you need and when you want it done.</p>
              
              {submitted && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl mb-6">
                  Thank you! We'll get back to you soon.
                </div>
              )}

              <ContactFormClient />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-slate-50">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <span className="pill">Meet the team</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Your SkyTech leads</h2>
            <p className="text-slate-600 max-w-2xl">Core leaders who guide delivery and keep communication smooth.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((person) => (
              <div key={person.id} className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="h-12 w-12 rounded-full object-cover border border-slate-100"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <p className="text-lg font-bold text-slate-900">{person.name}</p>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mt-1">
                      {person.role}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3">{person.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

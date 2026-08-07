"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const countryContacts = [
  { country: "Ghana", flag: "/images/icons/GhanaFlag.svg", phone: "+233 055 289 2433" },
  { country: "Nigeria", flag: "/images/icons/NigeriaFlag.svg", phone: "+234 000 000 0000" },
  { country: "Kenya", flag: "/images/icons/KenyaFlag.svg", phone: "+254 000 000 000" },
  { country: "United Kingdom", flag: "/images/icons/UKFlag.svg", phone: "+44 000 000 0000" },
  { country: "United States", flag: "/images/icons/USFlag.svg", phone: "+1 000 000 0000" },
];

export default function ContactClient({ settings, teamMembers, contactContent }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' });
      }
    } catch (err) {
      console.error('Contact form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-28 pb-20">
      {/* Hero */}
      <section className="pb-16">
        <div className="section-shell text-center space-y-4 max-w-3xl mx-auto">
          <span className="pill">Get in Touch</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            Let&apos;s Build Something <span className="text-blue-600">Great Together</span>
          </h1>
          <p className="text-lg text-slate-500">
            Tell us about your project and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Form + Map Split */}
      <section className="pb-24">
        <div className="section-shell">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-8 lg:p-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Message Sent!</h3>
                  <p className="text-slate-500">We&apos;ll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-primary mt-4"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Project Inquiry</h2>
                  <p className="text-sm text-slate-500 mb-6">Fill out the form below and we&apos;ll reach out shortly.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="+233 000 000 0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Service Needed</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a service</option>
                      <option value="website">Website Development</option>
                      <option value="mobile">Mobile App Development</option>
                      <option value="seo">SEO & Growth</option>
                      <option value="security">Security Systems</option>
                      <option value="maintenance">Maintenance & Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Right Side - Map & Contact Info */}
            <div className="space-y-8">
              {/* Map */}
              <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm h-64 lg:h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.6845994752326!2d-0.10359742413706885!3d5.624750132814997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9c1a8e9b7f5d%3A0x7f7e6fb7b0f6c4e!2sSpintex%20Rd%2C%20Accra!5e0!3m2!1sen!2sgh!4v1691234567890!5m2!1sen!2sgh"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Skytech Ghana Location"
                />
              </div>

              {/* Direct Contact Info */}
              <div className="rounded-3xl bg-slate-50 border border-slate-100 p-8 space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Direct Contact</h3>
                <div className="space-y-4">
                  <a href="mailto:hello@skytech.com" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors">
                    <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </span>
                    <span className="text-sm font-medium">hello@skytech.com</span>
                  </a>
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </span>
                    <span className="text-sm font-medium">Nii Ankrah Road - Dnor Plaza, Spintex</span>
                  </div>
                </div>
              </div>

              {/* Country Contacts with Flags */}
              <div className="rounded-3xl bg-white border border-slate-100 p-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">International Support</h3>
                <div className="space-y-3">
                  {countryContacts.map((contact) => (
                    <div key={contact.country} className="flex items-center gap-3 py-2">
                      <div className="relative w-7 h-5 rounded-sm overflow-hidden flex-shrink-0">
                        <Image src={contact.flag} alt={`${contact.country} flag`} fill className="object-cover" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 flex-1">{contact.country}</span>
                      <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                        {contact.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

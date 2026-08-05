"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const sampleInterns = [
  { name: "Daniel Asante", role: "Frontend Developer", image: null },
  { name: "Priscilla Mensah", role: "UI/UX Designer", image: null },
  { name: "Emmanuel Ofori", role: "Backend Developer", image: null },
  { name: "Sandra Adjei", role: "Mobile Developer", image: null },
];

export default function InternshipClient({ internshipContent }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    course: '',
    interest: '',
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
      const res = await fetch('/api/internship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', school: '', course: '', interest: '', message: '' });
      }
    } catch (err) {
      console.error('Internship form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero / CSR Intro */}
      <section className="relative bg-slate-950 text-white pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/images/intern-x.png"
            alt="Internship program"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-slate-950" />

        <div className="section-shell relative z-10">
          <div className="max-w-3xl space-y-6">
            <span className="pill bg-white/10 text-blue-300 border-white/10">CSR Initiative</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Internship & <span className="text-blue-400">Attachment Program</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              We&apos;re committed to nurturing the next generation of tech talent in Ghana. Our internship program gives students real-world experience on real projects.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-24 bg-white">
        <div className="section-shell">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="pill">Why Join Us</span>
              <h2 className="text-4xl font-bold text-slate-900 leading-tight tracking-tight">
                Get Real Experience on <span className="text-blue-600">Real Projects</span>
              </h2>
              <div className="space-y-4">
                {[
                  { title: "Work on Live Projects", desc: "You won't be fetching coffee. You'll be building features that real users interact with." },
                  { title: "Mentorship from Senior Engineers", desc: "Get paired with experienced developers who guide you through professional workflows." },
                  { title: "Build Your Portfolio", desc: "Leave with tangible work samples that impress future employers." },
                  { title: "Flexible Schedule", desc: "We work with your academic calendar to make the experience smooth." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl bg-blue-50">
                <Image
                  src="/images/images/globeImage.png"
                  alt="Global tech community"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enrolled Interns */}
      <section className="py-20 bg-slate-50">
        <div className="section-shell space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="pill">Current Cohort</span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Enrolled Interns
            </h2>
            <p className="text-slate-500">
              Meet some of the talented individuals currently in our program.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sampleInterns.map((intern, idx) => (
              <div
                key={idx}
                className="text-center space-y-3 p-6 rounded-3xl bg-white border border-slate-100 card-hover"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center overflow-hidden">
                  {intern.image ? (
                    <Image src={intern.image} alt={intern.name} width={80} height={80} className="object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">{intern.name[0]}</span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">{intern.name}</h3>
                <p className="text-xs text-blue-600 font-medium">{intern.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-24 bg-white">
        <div className="section-shell max-w-3xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <span className="pill">Apply Now</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Submit Your Application
            </h2>
            <p className="text-slate-500">
              Fill out the form below and our team will review your application within 5 business days.
            </p>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center rounded-3xl bg-slate-50 border border-slate-100">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Application Submitted!</h3>
              <p className="text-slate-500">We&apos;ll review your application and get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-3xl bg-white border border-slate-100 shadow-sm p-8 lg:p-10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="+233 000 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">School / University</label>
                  <input type="text" name="school" value={formData.school} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Your school"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Area of Interest</label>
                <select name="interest" value={formData.interest} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">Select your area of interest</option>
                  <option value="frontend">Frontend Development</option>
                  <option value="backend">Backend Development</option>
                  <option value="mobile">Mobile Development</option>
                  <option value="uiux">UI/UX Design</option>
                  <option value="devops">DevOps</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Why do you want to join? *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Tell us about yourself and why you'd be a great fit..."
                />
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

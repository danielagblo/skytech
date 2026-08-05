"use client";

import { useState } from 'react';

export default function TestimonialsSection({ testimonials }: { testimonials: Array<{ name?: string; message?: string; text?: string; content?: string; role?: string; company?: string }> }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="section-shell space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="pill">Testimonials</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            What Our Partners Say
          </h2>
          <p className="text-lg text-slate-600">
            Real feedback from real clients we&apos;ve worked with.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 6).map((testimonial, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:bg-white transition-all duration-500"
            >
              {/* Quote mark */}
              <div className="text-blue-200 text-6xl font-serif leading-none mb-4">&ldquo;</div>

              <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                {testimonial.message || testimonial.text || testimonial.content}
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {(testimonial.name || "C")[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{testimonial.name || "Client"}</p>
                  <p className="text-xs text-slate-500">{testimonial.role || testimonial.company || ""}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

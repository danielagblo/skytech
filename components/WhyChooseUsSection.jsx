'use client';

import Image from 'next/image';

export default function WhyChooseUsSection() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden border-b border-slate-100">
      <div className="section-shell space-y-16">
        {/* Title Block */}
        <div className="max-w-3xl space-y-4">
          <span className="pill text-blue-600 bg-blue-50">Why Choose Us</span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Why We're the Preferred Choice for Digital Business Development Service
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl">
            Our commitment is to deliver high-quality work with absolute integrity.
          </p>
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Image & Taglines */}
          <div className="space-y-8">
            <div className="relative w-full aspect-[4/3] rounded-[3.5rem] overflow-hidden shadow-xl bg-white border border-slate-100">
              <Image
                src="/images/images/manSitting.png"
                alt="Skytech developer working"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Here Is Why Title Block */}
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                Here Is Why
              </h3>
              <p className="text-2xl font-bold text-slate-400">
                You Need Us.
              </p>
            </div>
          </div>

          {/* Right Column: Grid Blocks */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900">Proven Expertise</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Highly adequate & senior developer team actively building high performance software without client barriers.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900">Our Relationship With You</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We value relationships with our clients with transparency, we don't cheat nor building secrets.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900">Complimentary Maintenance</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We provide initial technical support maintenance to ensure your platform stays secure, optimized, and running smoothly.
                </p>
              </div>

              {/* Card 4 */}
              <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-900">Teamwork</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Our creative team merge with your team working side by side to support your business goals.
                </p>
              </div>
            </div>

            {/* Extra transparent block text */}
            <div className="pt-6 border-t border-slate-200">
              <span className="text-sm font-extrabold uppercase tracking-widest text-slate-400">
                Bulk Reductions, 100% Transparency
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

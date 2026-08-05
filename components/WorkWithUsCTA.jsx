'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function WorkWithUsCTA() {
  return (
    <section className="py-24 bg-white">
      <div className="section-shell">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white shadow-2xl p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Decorative mesh/grid background */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <div className="space-y-6 max-w-xl relative z-10">
            <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
              Work With Us!
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Have an idea, project, or operational bottleneck we can solve? Let's team up to build digital products that actually drive results.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link href="/site/contact" className="px-8 py-4 bg-white text-blue-600 hover:bg-slate-50 font-bold rounded-full transition-all active:scale-95 shadow-lg">
                Let's Talk
              </Link>
            </div>
          </div>

          <div className="relative w-72 h-72 md:w-80 md:h-80 flex-shrink-0 z-10">
            <Image
              src="/images/images/workWithUs.png"
              alt="Work with Skytech"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

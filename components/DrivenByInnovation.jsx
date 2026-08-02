'use client';

import Image from 'next/image';

export default function DrivenByInnovation() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="section-shell">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="pill text-blue-600 bg-blue-50">Who We Are</span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Driven by Innovation.<br />
              <span className="text-blue-600">Powered by People.</span>
            </h2>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                We believe that software should be beautiful, reliable, and a joy to use. But more than that, it should solve real business problems. We're a team of product-minded engineers, designers, and builders who care deeply about your success.
              </p>
              <p>
                Whether you need a new web platform, a mobile experience your users love, or rock-solid cloud infrastructure, we work closely as extensions of your team to turn ideas into growth.
              </p>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              <Image
                src="/images/images/DrivenByInnovationImage.png"
                alt="Driven by Innovation at SkyTech"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

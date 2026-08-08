'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function OurStory() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="section-shell">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative w-full max-w-lg aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              <Image
                src="/images/images/HowSkytechCameToImage.png"
                alt="Skytech Founders story"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="space-y-8 order-1 lg:order-2">
            <span className="pill text-blue-600 bg-blue-50">Our Roots</span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
              It All Started <br />
              <span className="text-blue-600">With a Frustration.</span>
            </h2>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                We got tired of seeing agencies deliver buggy, slow websites that didn't help businesses grow, all while hiding behind confusing jargon and astronomical fees.
              </p>
              <p>
                SkyTech was founded to be different: a team of senior, product-minded creators who communicate with complete honesty, ship clean software with speed, and treat your business goals like our own.
              </p>
            </div>
            <div className="pt-4">
              <Link href="/about" className="btn-primary px-8 py-4 rounded-full">
                Read our story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

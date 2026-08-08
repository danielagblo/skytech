import Image from "next/image";

function TermsOfUsePage() {
  return (
    <div className="text-xl">
      {/* Banner Wrapper: dark background matching navbar to prevent white gaps, with top padding so image starts below navbar */}
      <div className="relative w-full bg-slate-950 pt-[60px] md:pt-[80px]">
        <div className="relative h-64 md:h-80 w-full">
          <Image
            src="/images/images/AboutBanner.png"
            alt="Terms of Use"
            fill
            className="object-cover opacity-85"
            priority
          />
          {/* Dark gradient overlay on top of the image */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent z-10" />

          {/* Title overlay directly on the hero image */}
          <div className="absolute bottom-24 md:bottom-36 left-6 md:left-12 z-20">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
              Terms of Use
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1">
              Last Updated: August 08, 2026
            </p>
          </div>
        </div>
      </div>

      {/* Overlapping Content Section */}
      <div className="relative z-10 -mt-20 md:-mt-32 bg-white p-6 md:p-10">
        <div className="max-w-4xl mx-auto space-y-8 text-slate-700 leading-relaxed text-sm md:text-base pt-4">
          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the website of Skytech Ghana, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this website or our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on Skytech Ghana&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials.</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
              <li>Attempt to decompile or reverse engineer any software contained on Skytech Ghana&apos;s website.</li>
              <li>Remove any copyright or other proprietary notations from the materials.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">3. Disclaimer</h2>
            <p>
              The materials on Skytech Ghana&apos;s website are provided on an &apos;as is&apos; basis. Skytech Ghana makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">4. Limitations of Liability</h2>
            <p>
              In no event shall Skytech Ghana or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Skytech Ghana&apos;s website, even if Skytech Ghana or a Skytech Ghana authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">5. Intellectual Property</h2>
            <p>
              All trademarks, logos, copy, designs, and graphics rendered on this website are the intellectual property of Skytech Ghana. Unauthorized reuse, duplication, or hotlinking of assets without express written consent from our management is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">6. Governing Law</h2>
            <p>
              Any claim relating to Skytech Ghana&apos;s website or services shall be governed by the laws of the Republic of Ghana without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsOfUsePage;

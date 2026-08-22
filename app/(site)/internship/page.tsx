import Image from "next/image";

import InternshipForm from "@/components/skytech/sections/internship/InternshipForm";

export const dynamic = "force-dynamic";

function InternshipPage() {
  return (
    <div className="overflow-x-hidden bg-white">
      <section className="relative overflow-hidden bg-slate-950 pt-24 pb-12 text-white sm:pt-28 sm:pb-16 md:pb-20">
        <Image
          src="/images/images/AboutBanner.png"
          alt="Skytech Ghana Internships"
          width={1600}
          height={160}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-brand-600/40 blur-[120px]" />

        <div className="section-shell relative px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 md:grid-cols-[2fr_1fr]">
            <div className="order-2 md:order-1">
              <span className="pill">Internship &amp; Attachment</span>
              <h1 className="font-display mt-4 text-2xl font-semibold uppercase leading-tight text-white sm:mt-5 sm:text-3xl md:text-4xl lg:text-5xl">
                Internships &amp; Attachment Programs as CSR
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-300 sm:mt-5 sm:text-lg md:max-w-xl">
                At SkyTech Ghana, we don&apos;t believe in fetching coffee or filing
                paperwork. We believe in building. Our internship and industrial
                attachment programs are designed for ambitious students and
                fresh graduates who want to bridge the gap between
                classroom theory and real-world tech developing.
              </p>
            </div>
            <div className="relative order-1 mx-auto w-full max-w-[16rem] sm:max-w-[20rem] md:order-2 md:max-w-[25rem]">
              <div className="absolute inset-0 -m-4 rounded-3xl bg-brand-600/20 blur-2xl sm:-m-6" />
              <Image
                src="/images/images/internshipsAndAttachments.png"
                alt="Driven by Innovation"
                width={400}
                height={400}
                className="relative h-auto w-full rounded-none"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <InternshipForm />
    </div>
  );
}

export default InternshipPage;
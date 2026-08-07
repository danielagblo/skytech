import Image from "next/image";

import EnrolledInterns from "@/components/skytech/sections/internship/EnrolledInterns";
import InternshipForm from "@/components/skytech/sections/internship/InternshipForm";
import { getEnrolledInterns } from "@/app/lib/interns";

async function InternshipPage() {
  const interns = await getEnrolledInterns();
  return (
    <div className="overflow-x-hidden bg-white">
      <section className="relative overflow-hidden bg-slate-950 pt-28 pb-16 text-white md:pb-20">
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

        <div className="section-shell relative">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[2fr_1fr]">
            <div>
              <span className="pill">Internship &amp; Attachment</span>
              <h1 className="font-display mt-5 text-4xl font-semibold uppercase leading-[1.1] text-white sm:text-5xl">
                INTERNSHIPS &amp; ATTACHMENT <br className="hidden md:block" /> PROGRAMS AS CSR
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
                At SkyTech Ghana, we don&apos;t believe in fetching coffee or filing
                paperwork. We believe in building. Our internship and industrial
                attachment programs are designed for ambitious students and
                fresh graduates who want to bridge the gap between
                classroom theory and real-world tech developing.
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-[25rem]">
              <div className="absolute inset-0 -m-6 rounded-3xl bg-brand-600/20 blur-2xl" />
              <Image
                src="/images/images/internshipsAndAttachments.png"
                alt="Driven by Innovation"
                width={400}
                height={400}
                className="relative h-auto w-full max-w-[25rem] rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      <EnrolledInterns interns={interns} />
      <InternshipForm />
    </div>
  );
}

export default InternshipPage;
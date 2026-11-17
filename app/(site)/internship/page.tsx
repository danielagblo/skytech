import Image from "next/image";
import InternshipForm from "@/components/skytech/sections/internship/InternshipForm";

export const dynamic = "force-dynamic";

function InternshipPage() {
  return (
    <div className="overflow-x-hidden bg-[#F6F4F0]">
      <section className="studio-hero">
        <div className="section-shell">
          <div className="grid items-end gap-10 md:grid-cols-[1.3fr_0.7fr]">
            <div className="max-w-2xl">
              <span className="eyebrow">Internship</span>
              <h1 className="section-title mt-5">Internships and attachment, treated as real work</h1>
              <p className="section-lead mt-5">
                At Skytech Ghana the placement is for building, not for errands. The internship and
                industrial attachment programs are for students and graduates who want the distance
                between the classroom and a working product to get shorter.
              </p>
            </div>
            <div className="border border-[#E3DDD4] bg-white p-4">
              <Image
                src="/images/images/internshipsAndAttachments.png"
                alt="Internship program"
                width={400}
                height={400}
                className="h-auto w-full"
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
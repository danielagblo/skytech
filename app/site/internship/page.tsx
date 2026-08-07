import Image from "next/image";

import EnrolledInterns from "@/components/skytech/sections/internship/EnrolledInterns";
import InternshipForm from "@/components/skytech/sections/internship/InternshipForm";
import { getEnrolledInterns } from "@/app/lib/interns";

async function InternshipPage() {
  const interns = await getEnrolledInterns();
  return (
    <div className="text-xl">
      <Image
        src="/images/images/AboutBanner.png"
        alt="About Us"
        width={1600}
        height={160}
        className="w-screen h-40 object-cover"
      />
      <div className="grid grid-cols-1 px-6 gap-5 items-center justify-center text-center md:grid-cols-[2fr_1fr] md:pl-12 md:pr-[3.75rem] md:px-0 md:text-left">
        <div>
          <span className="pill">Internship &amp; Attachment</span>
          <h1 className="text-3xl max-md:mt-4 uppercase mb-3 md:text-5xl">
            INTERNSHIPS &amp; ATTACHMENT <br />PROGRAMS AS CSR
          </h1>
          <p className="text-slate-600">
            At SkyTech Ghana, we don&apos;t believe in fetching coffee or filing
            paperwork. We believe in building. Our internship and industrial
            attachment programs are designed for ambitious students and
            fresh graduates who want to bridge the gap between
            classroom theory and real-world tech developing.
          </p>
        </div>
        <div className="p-6 md:p-10">
          <Image
            src="/images/images/internshipsAndAttachments.png"
            alt="Driven by Innovation"
            width={400}
            height={400}
            className="h-auto w-full max-w-[25rem] mx-auto md:w-[25rem]"
          />
        </div>
      </div>

      <EnrolledInterns interns={interns} />
      <InternshipForm />
    </div>
  );
}

export default InternshipPage;

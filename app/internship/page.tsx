import Image from "next/image"

import EnrolledInterns from "@/components/sections/internship/EnrolledInterns"

import aboutBanner from "@/assets/images/AboutBanner.png"
import InternshipsAndAttachmentsImage from "@/assets/images/internshipsAndAttachments.png"
import InternshipForm from "@/components/sections/internship/InternshipForm"

function InternshipPage() {
  return (
    <div className="text-xl">
      <Image
        src={aboutBanner}
        alt="About Us"
        className="w-screen h-40 object-cover"
      />
      <div className="grid grid-cols-1 px-6 gap-5 items-center justify-center text-center md:grid-cols-[2fr_1fr] md:pl-12 md:pr-15 md:px-0 md:text-left">
        <div>
          <h1 className="text-3xl uppercase mb-3 md:text-5xl">
            INTERNSHIPS & ATTACHMENT <br />PROGRAMS AS CSR
          </h1>
          <p>
            At SkyTech Ghana, we don&apos;t believe in fetching coffee or filing
            paperwork. We believe in building. Our internship and industrial
            attachment programs are designed for ambitious students and
            fresh graduates who want to bridge the gap between
            classroom theory and real-world tech developing.
          </p>
        </div>
        <div className="p-6 md:p-10">
          <Image
            src={InternshipsAndAttachmentsImage}
            alt="Driven by Innovation"
            className="h-auto w-full max-w-100 mx-auto md:w-100"
          />
        </div>
      </div>

      <EnrolledInterns />
      <InternshipForm />
    </div>
  )
}

export default InternshipPage

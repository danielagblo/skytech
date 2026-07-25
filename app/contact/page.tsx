import Image from "next/image"

import ContactForm from "@/components/sections/contact/ContactForm"
import FAQs from "@/components/sections/FAQ"

import aboutBanner from "@/assets/images/AboutBanner.png"
import SkytechBanner0 from "@/assets/images/SkytechBanner0.png"

function page() {
  return (
    <div>
      <div className="md:fixed top-0 w-screen z-20">
        <Image src={SkytechBanner0} alt="Skytech Ghana" className="w-screen h-auto" />
      </div>
      <Image
        src={aboutBanner}
        alt="About Us"
        className="w-screen h-40 object-cover"
      />
      <ContactForm />
      <div className="p-6 mt-0 md:-mt-45">
        <FAQs />
      </div>
    </div>
  )
}

export default page

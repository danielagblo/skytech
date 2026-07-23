import Image from "next/image"

import ContactForm from "@/components/sections/contact/ContactForm"
import FAQs from "@/components/sections/FAQ"

import aboutBanner from "@/assets/images/AboutBanner.png"

function page() {
  return (
    <div>
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

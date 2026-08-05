import Image from "next/image";

import ContactForm from "@/components/skytech/sections/contact/ContactForm";
import FAQs from "@/components/skytech/sections/FAQ";
import { groupFAQs } from "@/components/skytech/sections/faqGroup";
import { getFAQs } from "@/app/lib/faqs";

export default async function ContactPage() {
  const faqs = await getFAQs();

  return (
    <div>
      <div className="md:fixed top-0 w-screen z-20">
        <Image src="/images/images/SkytechBanner0.png" alt="Skytech Ghana" width={1600} height={240} className="w-screen h-auto" />
      </div>
      <Image
        src="/images/images/AboutBanner.png"
        alt="About Us"
        width={1600}
        height={160}
        className="w-screen h-40 object-cover"
      />
      <ContactForm />
      <div className="p-6 mt-0 md:-mt-[11.25rem]">
        <FAQs faqs={groupFAQs(faqs)} />
      </div>
    </div>
  );
}

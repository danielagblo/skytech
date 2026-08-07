import Image from "next/image";

import ContactForm from "@/components/skytech/sections/contact/ContactForm";
import FAQs from "@/components/skytech/sections/FAQ";
import { groupFAQs } from "@/components/skytech/sections/faqGroup";
import { getFAQs } from "@/app/lib/faqs";

export default async function ContactPage() {
  const faqs = await getFAQs();

  return (
    <div className="overflow-x-hidden bg-white">
      <section className="relative overflow-hidden bg-slate-950 pt-28 pb-16 text-white md:pb-20">
        <Image
          src="/images/images/AboutBanner.png"
          alt="Contact Skytech Ghana"
          width={1600}
          height={160}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-brand-600/40 blur-[120px]" />

        <div className="section-shell relative">
          <div className="max-w-2xl">
            <span className="pill">Contact Us</span>
            <h1 className="font-display mt-5 text-4xl font-semibold uppercase leading-[1.1] text-white sm:text-5xl">
              WE&apos;D LOVE TO HEAR FROM YOU
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              Whether you have a project in mind, a question about our services, or want to
              partner with us, our team is ready to help.
            </p>
          </div>
        </div>
      </section>

      <ContactForm />

      <div className="px-6 md:px-10">
        <FAQs faqs={groupFAQs(faqs)} />
      </div>
    </div>
  );
}
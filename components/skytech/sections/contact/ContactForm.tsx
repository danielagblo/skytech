"use client";

import Image from "next/image";

import FlagsList from "@/components/skytech/ui/FlagsList";
import WhatsAppOfferForm from "@/components/skytech/sections/landing/WhatsAppOfferForm";

export default function ContactForm() {
  return (
    <section className="bg-[#F6F4F0] px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[80rem]">
        <div className="mb-12 max-w-2xl">
          <span className="eyebrow">Get in touch</span>
          <h2 className="section-title mt-5">Start a conversation</h2>
          <p className="section-lead mt-4">
            Share a few details and we will open WhatsApp so you can talk with the team directly.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="border border-[#E3DDD4] bg-white p-6 lg:p-10">
            <WhatsAppOfferForm extended showReturn={false} />
          </div>

          <div>
            <div className="site-map overflow-hidden border border-[#E3DDD4]">
              <iframe
                title="SkyTech Ghana"
                src="https://maps.google.com/maps?q=5.6519898,-0.0643809&z=19&output=embed"
                loading="lazy"
                className="h-64 w-full border-0"
                allowFullScreen
              />
            </div>

            <div className="mt-8 border border-[#E3DDD4] bg-white p-8">
              <h3 className="font-display text-2xl font-medium tracking-tight text-[#141413] md:text-3xl">
                Speak with support
              </h3>

              <div className="mt-8 space-y-4 text-base text-[#141413]">
                <p className="flex items-center gap-3">
                  <Image src="/images/icons/mailIcon.svg" alt="" width={20} height={20} />
                  <a href="mailto:info@skytechghana.com" className="text-[#1E5AC8]">info@skytechghana.com</a>
                </p>
                <p className="flex items-center gap-3">
                  <Image src="/images/icons/telephoneIcon.svg" alt="" width={20} height={20} />
                  <a href="tel:+233538311626" className="text-[#1E5AC8]">+233 53 831 1626</a>
                </p>
              </div>

              <div className="mt-8 border-t border-[#E3DDD4] pt-8">
                <p className="text-sm text-[#5C574F]">International enquiries</p>
                <div className="mt-3">
                  <FlagsList />
                </div>
                <div className="mt-4 space-y-4 text-base text-[#141413]">
                  <p className="flex items-center gap-3">
                    <Image src="/images/icons/mailIcon.svg" alt="" width={20} height={20} />
                    <a href="mailto:world@skytechghana.com" className="text-[#1E5AC8]">world@skytechghana.com</a>
                  </p>
                  <p className="flex items-center gap-3">
                    <Image src="/images/icons/telephoneIcon.svg" alt="" width={20} height={20} />
                    <a href="tel:+15582892433" className="text-[#1E5AC8]">+1 558 289 2433</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

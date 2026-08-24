"use client";

import Image from "next/image";

import FlagsList from "@/components/skytech/ui/FlagsList";
import WhatsAppOfferForm from "@/components/skytech/sections/landing/WhatsAppOfferForm";

export default function ContactForm() {
  return (
    <section className="bg-slate-50 px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="section-tag">Get in Touch</span>
          <h2 className="section-title mt-4 text-3xl text-balance sm:text-4xl lg:text-5xl">
            Start a WhatsApp chat
          </h2>
          <p className="section-lead mt-3 max-w-xl">
            Share a few details and we&apos;ll open WhatsApp so you can talk with our team right away.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="rounded-none border border-slate-100 bg-white p-8 shadow-lift lg:p-10">
            <WhatsAppOfferForm extended showReturn={false} />
          </div>

          <div>
            <div className="overflow-hidden rounded-none shadow-soft ring-1 ring-slate-100">
              <iframe
                title="SkyTech Ghana"
                src="https://maps.google.com/maps?q=5.6519898,-0.0643809&z=19&output=embed"
                loading="lazy"
                className="h-64 w-full border-0"
                allowFullScreen
              />
            </div>

            <div className="mt-8 rounded-none bg-gradient-to-b from-brand-50/60 to-white p-8 ring-1 ring-brand-100">
              <h3 className="font-display text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
                SPEAK TO OUR
                <br />
                24/7 SUPPORT.
              </h3>

              <div className="mt-8 space-y-3 text-lg">
                <div className="h-6 w-6 inline-block">
                  <Image src="/images/icons/mailIcon.svg" alt="Mail Icon" width={24} height={24} className="inline-block w-full h-full" />
                </div>
                &nbsp;&nbsp;
                <p className="inline-block text-brand-700">info@skytechghana.com</p>

                <br />
                <div className="h-6 w-6 inline-block">
                  <Image src="/images/icons/telephoneIcon.svg" alt="Telephone Icon" width={24} height={24} className="inline-block w-full h-full" />
                </div>
                &nbsp;&nbsp;
                <p className="inline-block text-brand-700">+233 53 831 1626</p>
              </div>

              <div className="mt-8">
                <p className="mb-2 text-slate-500">All international enquiries</p>

                <div className="flex items-center gap-2 text-2xl">
                  <FlagsList />
                </div>

                <div className="mt-4 space-y-3 text-lg">
                  <div className="h-6 w-6 inline-block">
                    <Image src="/images/icons/mailIcon.svg" alt="Mail Icon" width={24} height={24} className="inline-block w-full h-full" />
                  </div>
                  &nbsp;&nbsp;
                  <p className="inline-block text-brand-700">world@skytechghana.com</p>

                  <br />
                  <div className="h-6 w-6 inline-block">
                    <Image src="/images/icons/telephoneIcon.svg" alt="Telephone Icon" width={24} height={24} className="inline-block w-full h-full" />
                  </div>
                  &nbsp;&nbsp;
                  <p className="inline-block text-brand-700">+1 558 289 2433</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

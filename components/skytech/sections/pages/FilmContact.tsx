"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getWhatsAppUrl } from "@/app/lib/whatsapp";
import { useRise } from "@/components/skytech/motion/useRise";
import WhatsAppOfferForm from "@/components/skytech/sections/landing/WhatsAppOfferForm";

gsap.registerPlugin(useGSAP);

export default function FilmContact({
  contactEmail = "hello@skytechgh.com",
  contactPhone = "+233 53 831 1626",
  whatsapp,
  siteName = "Skytech Ghana",
}: {
  contactEmail?: string;
  contactPhone?: string;
  whatsapp?: string;
  siteName?: string;
}) {
  const ref = useRise<HTMLDivElement>();
  const root = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const phoneHref = `tel:${contactPhone.replace(/[^\d+]/g, "")}`;
  const mailHref = `mailto:${contactEmail}`;
  const chatHref = getWhatsAppUrl(whatsapp);

  useGSAP(() => {
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      const open = gsap.timeline({ defaults: { ease: "power3.out" } });
      open.fromTo("[data-board]", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7 });
      open.fromTo("[data-intro]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.15);
      open.fromTo("[data-line]", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.28);
      gsap.to("[data-glow]", {
        x: 36,
        y: 24,
        scale: 1.08,
        duration: 5.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
    return () => motion.revert();
  }, { scope: root });

  const focusForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    formRef.current?.querySelector<HTMLElement>("input, textarea, select")?.focus();
  };

  return (
    <div ref={ref} className="flex h-full min-h-0 flex-1 flex-col px-3 pb-3 pt-2 md:px-4 md:pb-4">
      <div ref={root} className="flex min-h-0 flex-1 flex-col">
        <div data-board className="grid h-full min-h-[32rem] flex-1 grid-cols-1 overflow-y-auto rounded-[28px] bg-white md:min-h-0 md:grid-cols-2 md:overflow-hidden">
          <div className="relative flex min-h-0 flex-col bg-gradient-to-b from-[#d5f5a8] via-[#e7f6c4] to-[#f6f6f4] p-5 md:p-6">
            <div data-glow className="pointer-events-none absolute -left-10 top-8 h-48 w-48 rounded-full bg-white/60 blur-3xl" />
            <div className="relative flex flex-wrap items-start justify-between gap-3">
              <div data-intro className="flex max-w-sm items-center gap-3">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#161616]">
                  <Image src="/skytechlogoonly.png" alt="" fill className="object-cover" sizes="64px" />
                </span>
                <p className="text-sm leading-snug">
                  <span className="font-medium">{siteName}</span>
                  <span className="text-black/70"> — in Accra, here for the first step of the project.</span>
                </p>
              </div>
              <div data-intro className="flex flex-wrap gap-2">
                <a href={mailHref} className="rounded-full bg-[#161616] px-4 py-2 text-sm text-white">
                  {contactEmail}
                </a>
                <button type="button" onClick={focusForm} className="rounded-full bg-[#161616] px-4 py-2 text-sm text-white">
                  Send message
                </button>
              </div>
            </div>

            <h1 className="relative mt-6 font-display text-[clamp(1.9rem,3.4vw,3.4rem)] font-medium leading-[0.92] tracking-tight md:mt-auto">
              <span data-line className="block">Every project</span>
              <span data-line className="block">starts with a plan.</span>
            </h1>

            <div data-intro className="relative mt-5 flex gap-2">
              <RoundLink href={mailHref} label="Email">
                <MailIcon />
              </RoundLink>
              <RoundLink href={phoneHref} label="Call">
                <PhoneIcon />
              </RoundLink>
              <RoundLink href={chatHref} label="WhatsApp">
                <ChatIcon />
              </RoundLink>
              <RoundLink href="https://maps.google.com/maps?q=5.6519898,-0.0643809" label="Accra">
                <PinIcon />
              </RoundLink>
            </div>
          </div>

          <div ref={formRef} className="flex min-h-0 flex-col overflow-y-auto bg-white p-5 md:p-6">
            <WhatsAppOfferForm
              showReturn={false}
              showWhatsAppLabel={false}
              subtitle="One question at a time."
              whatsappNumber={whatsapp}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function RoundLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#161616] text-white transition hover:scale-105">
      {children}
    </a>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 6h16v12H4z" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M8 4h3l1 4-2 1a12 12 0 006 6l1-2 4 1v3a2 2 0 01-2 2A16 16 0 016 6a2 2 0 012-2z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M12 3a9 9 0 00-7.7 13.6L3 21l4.6-1.2A9 9 0 1012 3zm4.2 11.4c-.2-.1-1.2-.6-1.4-.7-.2-.1-.4-.1-.5.1l-.6.8c-.1.2-.3.2-.5.1a6.6 6.6 0 01-3.2-2.8c-.1-.2 0-.3.1-.4l.4-.5.2-.3c0-.2 0-.3-.1-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.7.7-.7 1.7s.7 2 .8 2.1c.1.2 1.4 2.2 3.5 3 .5.2.9.4 1.2.5.5.2 1 .1 1.3.1.4-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1 0-.1-.2-.2-.4-.3z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}

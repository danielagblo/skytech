"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl, WHATSAPP_NUMBER } from "@/app/lib/whatsapp";
import { WA_THANKYOU_KEY } from "@/app/lib/waThankYou";

interface ThankYouPayload {
  message?: string;
  number?: string;
  name?: string;
}

export default function ThankYouClient() {
  const [payload, setPayload] = useState<ThankYouPayload | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(WA_THANKYOU_KEY);
      if (raw) {
        setPayload(JSON.parse(raw));
        sessionStorage.removeItem(WA_THANKYOU_KEY);
      }
    } catch {
      // ignore
    } finally {
      setReady(true);
    }
  }, []);

  const number = payload?.number || WHATSAPP_NUMBER;
  const waUrl = getWhatsAppUrl(number, payload?.message);
  const firstName = payload?.name?.trim().split(/\s+/)[0];

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#2f59c1]/30 border-t-[#2f59c1]" />
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-5 py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[#2f59c1]/10 to-transparent" />
      <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#2f59c1]/15 blur-[90px]" />

      <section className="relative z-10 mx-auto w-full max-w-md text-center">
        <div className="mx-auto mb-8 flex w-fit flex-col items-center">
          <div className="relative">
            <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-[#2f59c1]/15 shadow-lg">
              <Image
                src="/images/icons/support-agent.jpg"
                alt="Skytech support"
                fill
                sizes="96px"
                className="object-cover object-top"
              />
            </div>
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
            Online now
          </p>
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2f59c1]">
          Form received!
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          {firstName ? `Thanks, ${firstName}` : "Thank you"}
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-slate-600 sm:text-lg">
          Want a faster response? Launch a WhatsApp chat with our team right now —
          we usually reply in minutes.
        </p>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#20bd5c] active:scale-[0.98]"
        >
          <Image
            src="/images/icons/whatsappLogo.svg"
            alt=""
            width={20}
            height={20}
            className="brightness-0 invert"
          />
          Chat on WhatsApp
        </a>

        <p className="mt-4 text-xs text-slate-500">
          Your details are ready — tapping opens WhatsApp with your message filled in.
        </p>

        <Link
          href="/"
          className="mt-10 inline-block text-sm font-medium text-slate-500 transition hover:text-[#2f59c1]"
        >
          Back to homepage
        </Link>
      </section>
    </main>
  );
}

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-emerald-600" strokeWidth={2.5}>
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Form received!</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
        {firstName ? `Thanks, ${firstName}` : "Thank you"}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
        Want a faster response? Click below to launch a WhatsApp chat with our team right now.
      </p>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-[#1ebe57] active:scale-[0.98] sm:w-auto sm:min-w-[280px]"
      >
        <Image
          src="/images/icons/whatsappLogo.svg"
          alt=""
          width={22}
          height={22}
          className="brightness-0 invert"
        />
        Chat on WhatsApp now
      </a>

      <Link href="/" className="mt-6 text-sm font-medium text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline">
        Back to homepage
      </Link>
    </section>
  );
}

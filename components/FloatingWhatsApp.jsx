"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import BottomSheet from "@/components/skytech/ui/BottomSheet";
import WhatsAppOfferForm from "@/components/skytech/sections/landing/WhatsAppOfferForm";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/landing") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Chat on WhatsApp"
        className="group fixed bottom-10 right-5 z-50 flex items-center gap-2 cursor-pointer"
      >
        <span className="pointer-events-none max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-slate-900 text-sm font-medium text-white opacity-0 shadow-lg transition-all duration-300 group-hover:max-w-xs group-hover:px-4 group-hover:py-2 group-hover:opacity-100">
          Chat with us
        </span>
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl border border-slate-100 transition-transform duration-300 group-hover:scale-110 active:scale-95">
          <Image
            src="/images/icons/whatsappLogo.svg"
            alt="WhatsApp Icon"
            width={38}
            height={38}
            className="object-contain"
          />
        </span>
      </button>

      <BottomSheet isOpen={open} onClose={() => setOpen(false)}>
        <WhatsAppOfferForm onClose={() => setOpen(false)} />
      </BottomSheet>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import BottomSheet from "@/components/skytech/ui/BottomSheet";
import WhatsAppOfferForm from "@/components/skytech/sections/landing/WhatsAppOfferForm";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [shake, setShake] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);

  useEffect(() => {
    if (pathname === "/landing" || open || bubbleDismissed) return;

    const showTimer = setTimeout(() => setShowBubble(true), 3500);
    return () => clearTimeout(showTimer);
  }, [pathname, open, bubbleDismissed]);

  useEffect(() => {
    if (pathname === "/landing" || open) return;

    const shakeOnce = () => {
      setShake(true);
      window.setTimeout(() => setShake(false), 750);
    };

    const firstShake = setTimeout(shakeOnce, 2500);
    const interval = setInterval(shakeOnce, 12000);

    return () => {
      clearTimeout(firstShake);
      clearInterval(interval);
    };
  }, [pathname, open]);

  if (pathname === "/landing") return null;

  const openChat = () => {
    setShowBubble(false);
    setOpen(true);
  };

  const dismissBubble = (e) => {
    e.stopPropagation();
    setShowBubble(false);
    setBubbleDismissed(true);
  };

  return (
    <>
      <div className="fixed bottom-10 right-5 z-50 flex flex-col items-end gap-3">
        {showBubble && !open && (
          <div
            role="dialog"
            aria-label="Support chat prompt"
            className="animate-wa-bubble-in relative w-[min(18rem,calc(100vw-2.5rem))] rounded-2xl border border-emerald-100 bg-white p-3.5 shadow-2xl shadow-emerald-900/15"
          >
            <button
              type="button"
              onClick={dismissBubble}
              aria-label="Dismiss chat prompt"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              ×
            </button>

            <div className="flex gap-3 pr-4">
              <div className="relative shrink-0">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white shadow-md">
                  SK
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">Skytech Support</p>
                <p className="mt-0.5 text-xs text-emerald-600">Online now</p>
                <p className="mt-2 text-sm leading-snug text-slate-600">
                  Hi! Need a website or app? Chat with us on WhatsApp — we usually reply in minutes.
                </p>
                <button
                  type="button"
                  onClick={openChat}
                  className="mt-3 w-full rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Start chat
                </button>
              </div>
            </div>
            <span className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 border-b border-r border-emerald-100 bg-white" />
          </div>
        )}

        <button
          type="button"
          onClick={openChat}
          aria-label="Chat on WhatsApp"
          className={`group relative flex items-center gap-2 cursor-pointer ${shake ? "animate-wa-shake" : ""}`}
        >
          {!showBubble && (
            <span className="pointer-events-none hidden sm:block max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-slate-900 text-sm font-medium text-white opacity-0 shadow-lg transition-all duration-300 group-hover:max-w-xs group-hover:px-4 group-hover:py-2 group-hover:opacity-100">
              Chat with us
            </span>
          )}

          <span className="relative flex h-14 w-14 items-center justify-center">
            <span className="animate-wa-pulse-ring absolute inset-0 rounded-full bg-emerald-500/40" />
            <span
              className="animate-wa-pulse-ring absolute inset-0 rounded-full bg-emerald-500/25"
              style={{ animationDelay: "0.7s" }}
            />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl shadow-emerald-600/40 ring-4 ring-white transition-transform duration-300 group-hover:scale-110 active:scale-95">
              <Image
                src="/images/icons/whatsappLogo.svg"
                alt="WhatsApp Icon"
                width={34}
                height={34}
                className="object-contain brightness-0 invert"
              />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                1
              </span>
            </span>
          </span>
        </button>
      </div>

      <BottomSheet isOpen={open} onClose={() => setOpen(false)}>
        <WhatsAppOfferForm onClose={() => setOpen(false)} />
      </BottomSheet>
    </>
  );
}

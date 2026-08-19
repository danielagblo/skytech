"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import Image from "next/image";

/* ── types ─────────────────────────────────────────────────── */

export interface WhatsAppPackageGroup {
  group: string;
  items: string[];
}

const TIMELINES = [
  "Urgent – within 1 week",
  "Soon – 1 to 2 weeks",
  "Standard – 2 to 4 weeks",
  "Flexible – 1 to 3 months",
];

/* ── context ───────────────────────────────────────────────── */

interface ModalCtx {
  open: (whatsappDigits: string) => void;
}

const Ctx = createContext<ModalCtx>({ open: () => {} });

export function useWhatsAppModal() {
  return useContext(Ctx);
}

/* ── provider + modal ──────────────────────────────────────── */

export function WhatsAppModalProvider({
  children,
  whatsapp,
  packages = [],
}: {
  children: ReactNode;
  whatsapp?: string;
  packages?: WhatsAppPackageGroup[];
}) {
  const [visible, setVisible] = useState(false);
  const [digits, setDigits] = useState("");
  const [pkg, setPkg] = useState("");
  const [timeline, setTimeline] = useState("");

  const open = useCallback(
    (d?: string) => {
      setDigits(
        d || (whatsapp ? String(whatsapp).replace(/[^\d]/g, "") : "233538311626")
      );
      setPkg("");
      setTimeline("");
      setVisible(true);
    },
    [whatsapp]
  );

  function proceed() {
    const lines = [
      `Hi Skytech Ghana!`,
      ``,
      `Package: *${pkg}*`,
      `Delivery timeline: *${timeline}*`,
    ];
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setVisible(false);
  }

  const ready = pkg !== "" && timeline !== "";

  return (
    <Ctx.Provider value={{ open }}>
      {children}

      {visible && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setVisible(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-6 sm:p-8 text-white animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close */}
            <button
              onClick={() => setVisible(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white transition"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* header */}
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/images/icons/whatsappLogo.svg"
                alt="WhatsApp"
                width={32}
                height={32}
              />
              <div>
                <h2 className="text-lg font-bold leading-tight">Chat with us on WhatsApp</h2>
                <p className="text-sm text-slate-400">Select a package and delivery timeline</p>
              </div>
            </div>

            {/* package select */}
            <label className="block mb-1 text-sm font-medium text-slate-300">Package</label>
            <select
              value={pkg}
              onChange={(e) => setPkg(e.target.value)}
              className="w-full mb-5 rounded-lg border border-white/10 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-brand-400 transition"
            >
              <option value="" disabled>
                Choose a package…
              </option>
              {packages.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* timeline select */}
            <label className="block mb-1 text-sm font-medium text-slate-300">
              How urgent is your project?
            </label>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full mb-6 rounded-lg border border-white/10 bg-slate-800 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-brand-400 transition"
            >
              <option value="" disabled>
                Select delivery timeline…
              </option>
              {TIMELINES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* proceed button */}
            <button
              disabled={!ready}
              onClick={proceed}
              className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition ${
                ready
                  ? "bg-[#25D366] text-white hover:bg-[#20bd5a] active:scale-[0.98]"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 00-8.66 15L2 22l5.13-1.32A10 10 0 1012 2zm4.5 13.25c-.25-.13-1.47-.73-1.7-.81s-.39-.13-.56.12-.63.82-.78.99-.29.18-.53.06a6.6 6.6 0 01-1.92-1.18 7.13 7.13 0 01-1.35-1.68c-.14-.24 0-.38.1-.5s.23-.25.35-.39a1.4 1.4 0 00.18-.3.4.4 0 000-.38c0-.12-.56-1.34-.77-1.84-.19-.49-.39-.44-.56-.44h-.48a.92.92 0 00-.66.31 2.79 2.79 0 00-.86 2.07A4.85 4.85 0 005.72 15a10 10 0 004.31 3.93 5.7 5.7 0 002.36.59 4.28 4.28 0 002.8-1.4c.4-.46.56-.68.6-.9a1.2 1.2 0 00-.2-.78c0-.13-.21-.18-.59-.4z" />
              </svg>
              Continue to WhatsApp
            </button>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

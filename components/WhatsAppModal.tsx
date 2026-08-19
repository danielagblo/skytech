"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import Image from "next/image";

/* ── types ─────────────────────────────────────────────────── */

export interface WhatsAppPackageGroup {
  group: string;
  items: string[];
}

const TIMELINES = [
  { label: "Urgent", desc: "Within 1 week", icon: "🔴" },
  { label: "Soon", desc: "1 – 2 weeks", icon: "🟠" },
  { label: "Standard", desc: "2 – 4 weeks", icon: "🟢" },
  { label: "Flexible", desc: "1 – 3 months", icon: "🔵" },
];

/* ── context ───────────────────────────────────────────────── */

interface ModalCtx {
  open: (whatsappDigits: string) => void;
}

const Ctx = createContext<ModalCtx>({ open: () => {} });

export function useWhatsAppModal() {
  return useContext(Ctx);
}

/* ── helpers ───────────────────────────────────────────────── */

function parsePkgString(raw: string) {
  const parts = raw.split("–").map((s) => s.trim());
  const name = parts[0] || raw;
  const price = parts[1] || "";
  return { name, price };
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
  const [activeGroup, setActiveGroup] = useState(0);

  const open = useCallback(
    (d?: string) => {
      setDigits(
        d || (whatsapp ? String(whatsapp).replace(/[^\d]/g, "") : "233538311626")
      );
      setPkg("");
      setTimeline("");
      setActiveGroup(0);
      setVisible(true);
    },
    [whatsapp]
  );

  function proceed() {
    const tl = TIMELINES.find((t) => t.label === timeline);
    const tlText = tl ? `${tl.label} – ${tl.desc}` : timeline;
    const lines = [
      `Hi Skytech Ghana!`,
      ``,
      `Package: *${pkg}*`,
      `Delivery timeline: *${tlText}*`,
    ];
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setVisible(false);
  }

  const ready = pkg !== "" && timeline !== "";
  const currentItems = packages[activeGroup]?.items || [];

  return (
    <Ctx.Provider value={{ open }}>
      {children}

      {visible && (
        <div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setVisible(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md border-b border-white/5 px-5 sm:px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/15">
                  <Image
                    src="/images/icons/whatsappLogo.svg"
                    alt="WhatsApp"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold leading-tight">Get Started</h2>
                  <p className="text-xs sm:text-sm text-slate-400">Pick a package & timeline, then chat with us</p>
                </div>
              </div>
              <button
                onClick={() => setVisible(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 sm:px-8 py-6 space-y-6">
              {/* Step 1 — Package */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-xs font-bold text-white">1</span>
                  <span className="text-sm font-semibold text-slate-200">Choose a package</span>
                </div>

                {/* Category tabs */}
                {packages.length > 1 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                    {packages.map((g, i) => (
                      <button
                        key={g.group}
                        onClick={() => setActiveGroup(i)}
                        className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                          activeGroup === i
                            ? "bg-white text-slate-900 shadow-md"
                            : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {g.group}
                      </button>
                    ))}
                  </div>
                )}

                {/* Package cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentItems.map((item) => {
                    const { name, price } = parsePkgString(item);
                    const selected = pkg === item;
                    return (
                      <button
                        key={item}
                        onClick={() => setPkg(item)}
                        className={`group relative text-left rounded-2xl border p-4 transition-all duration-200 ${
                          selected
                            ? "border-[#25D366] bg-[#25D366]/10 ring-1 ring-[#25D366]/40 shadow-lg shadow-[#25D366]/5"
                            : "border-white/8 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                        }`}
                      >
                        {selected && (
                          <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366]">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        <p className={`text-sm font-semibold leading-snug pr-6 ${selected ? "text-white" : "text-slate-200"}`}>
                          {name}
                        </p>
                        {price && (
                          <p className={`mt-1.5 text-xs font-bold ${selected ? "text-[#25D366]" : "text-slate-400"}`}>
                            {price}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/5" />

              {/* Step 2 — Timeline */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-xs font-bold text-white">2</span>
                  <span className="text-sm font-semibold text-slate-200">How urgent is your project?</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TIMELINES.map((t) => {
                    const selected = timeline === t.label;
                    return (
                      <button
                        key={t.label}
                        onClick={() => setTimeline(t.label)}
                        className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3.5 transition-all duration-200 ${
                          selected
                            ? "border-[#25D366] bg-[#25D366]/10 ring-1 ring-[#25D366]/40 shadow-lg shadow-[#25D366]/5"
                            : "border-white/8 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                        }`}
                      >
                        <span className="text-lg">{t.icon}</span>
                        <span className={`text-xs font-bold ${selected ? "text-white" : "text-slate-300"}`}>
                          {t.label}
                        </span>
                        <span className={`text-[10px] leading-tight ${selected ? "text-slate-300" : "text-slate-500"}`}>
                          {t.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer / CTA */}
            <div className="sticky bottom-0 border-t border-white/5 bg-slate-950/95 backdrop-blur-md px-5 sm:px-8 py-4">
              {pkg && (
                <p className="text-xs text-slate-400 mb-3 truncate">
                  <span className="text-slate-500">Selected:</span>{" "}
                  <span className="text-white font-medium">{pkg}</span>
                  {timeline && (
                    <>
                      <span className="text-slate-500 mx-1.5">•</span>
                      <span className="text-white font-medium">{timeline}</span>
                    </>
                  )}
                </p>
              )}
              <button
                disabled={!ready}
                onClick={proceed}
                className={`w-full flex items-center justify-center gap-2.5 rounded-xl px-5 py-3.5 text-sm font-bold transition-all duration-200 ${
                  ready
                    ? "bg-[#25D366] text-white hover:bg-[#20bd5a] active:scale-[0.98] shadow-lg shadow-[#25D366]/20"
                    : "bg-white/5 text-slate-500 cursor-not-allowed"
                }`}
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 00-8.66 15L2 22l5.13-1.32A10 10 0 1012 2zm4.5 13.25c-.25-.13-1.47-.73-1.7-.81s-.39-.13-.56.12-.63.82-.78.99-.29.18-.53.06a6.6 6.6 0 01-1.92-1.18 7.13 7.13 0 01-1.35-1.68c-.14-.24 0-.38.1-.5s.23-.25.35-.39a1.4 1.4 0 00.18-.3.4.4 0 000-.38c0-.12-.56-1.34-.77-1.84-.19-.49-.39-.44-.56-.44h-.48a.92.92 0 00-.66.31 2.79 2.79 0 00-.86 2.07A4.85 4.85 0 005.72 15a10 10 0 004.31 3.93 5.7 5.7 0 002.36.59 4.28 4.28 0 002.8-1.4c.4-.46.56-.68.6-.9a1.2 1.2 0 00-.2-.78c0-.13-.21-.18-.59-.4z" />
                </svg>
                Continue to WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

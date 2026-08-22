"use client";

import { useRef, useState } from "react";
import { WHATSAPP_NUMBER } from "@/app/lib/whatsapp";

interface WhatsAppOfferFormProps {
  packageName?: string;
  packagePrice?: string;
  onClose: () => void;
  whatsappNumber?: string;
}

const DEFAULT_WHATSAPP = WHATSAPP_NUMBER;

type LaunchTimeline = "in 1 week" | "1-2 months" | "3+ months";

const INDUSTRIES = [
  "Hospitality",
  "Retail & E-commerce",
  "Education",
  "Tourism & Logistics",
  "Real estate & construction",
  "Healthcare",
  "Tech",
  "NGO",
  "Religion",
  "Other",
];

const TIMELINES: LaunchTimeline[] = ["in 1 week", "1-2 months", "3+ months"];

function RequiredMark() {
  return <span className="text-red-500">*</span>;
}

function PillGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-lg border px-3.5 py-2 text-sm transition-colors ${active ? "border-slate-900 font-semibold text-slate-900" : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function WhatsAppOfferForm({
  packageName,
  packagePrice,
  onClose,
  whatsappNumber = DEFAULT_WHATSAPP,
}: WhatsAppOfferFormProps) {
  const [name, setName] = useState("");
  const [timeline, setTimeline] = useState<LaunchTimeline | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [sending, setSending] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const industryRef = useRef<HTMLDivElement | null>(null);

  const isValid = Boolean(name.trim() && industry);

  const scrollToFirstInvalidField = () => {
    const firstInvalidField =
      !name.trim()
        ? nameRef.current
        : !industry
          ? industryRef.current
          : null;

    firstInvalidField?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async () => {
    if (!isValid) {
      setShowErrors(true);
      scrollToFirstInvalidField();
      return;
    }

    const interestLine = packageName
      ? `Hi Skytech Ghana, I'd like to select the *${packageName}${packagePrice ? ` (${packagePrice})` : ""}*.\n`
      : `Hi Skytech Ghana, I'd like to chat about your services.\n`;

    const lines = [
      interestLine,
      ``,
      `Name: ${name}`,
      timeline ? `Launch timeline: ${timeline}` : null,
      `Industry: ${industry}`,
    ].filter(Boolean);

    const message = lines.join("\n");

    setSending(true);
    try {
      await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          recipients: [whatsappNumber],
        }),
      });
    } catch (error) {
      console.error("Failed to send Arkesel SMS:", error);
    } finally {
      setSending(false);
    }

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
    onClose();
  };

  const errorRing = (invalid: boolean) => (showErrors && invalid ? "border-red-300" : "border-emerald-200");

  return (
    <div className="text-center">
      <h2 className="text-2xl mt-2 font-bold text-slate-800">Well done!</h2>
      <p className="text-lg text-slate-600">One last step to get on</p>
      <p className="flex items-center justify-center gap-1.5 text-lg font-bold text-emerald-600">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-emerald-600">
          <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .9.9-2.9-.2-.3A8 8 0 1112 20zm4.4-5.9c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 4 3.4.6.2 1 .4 1.3.5.6.2 1.1.1 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1 0-.1-.2-.2-.4-.3z" />
        </svg>
        What&apos;sApp chat
      </p>

      <div className="mt-8 space-y-6 text-left">
        <div>
          <input
            ref={nameRef}
            type="text"
            value={name}
            autoComplete="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name *"
            className={`w-full rounded-full border bg-transparent px-4 py-2.5 text-center outline-none focus:border-slate-400 ${errorRing(!name.trim())}`}
          />
        </div>

        <div>
          <p className="mb-2 text-base text-slate-800 text-center">How soon do you plan to launch a website?</p>
          <PillGroup options={TIMELINES} value={timeline} onChange={setTimeline} />
        </div>

        <div>
          <div ref={industryRef}>
            <p className="mb-2 text-base text-slate-800">
              What industry do you operate? <RequiredMark />
            </p>
            <PillGroup options={INDUSTRIES} value={industry} onChange={setIndustry} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 py-3 font-semibold text-slate-800"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-slate-800" strokeWidth={2}>
            <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Return
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || sending}
          className={`flex-[2] rounded-lg py-3 font-semibold text-white transition-colors ${isValid && !sending ? "bg-emerald-600 hover:bg-emerald-700" : "cursor-not-allowed bg-emerald-300 text-white/80"
            }`}
        >
          {sending ? "Sending..." : "Open on What's App"}
        </button>
      </div>
    </div>
  );
}

export default WhatsAppOfferForm;

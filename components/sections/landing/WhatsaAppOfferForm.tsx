"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "233552892433";

interface WhatsAppOfferFormProps {
  packageName: string;
  packagePrice: string;
  onClose: () => void;
}

type MeetingAnswer = "Yes" | "No";
type PublicOfficeAnswer = "Yes" | "No" | "Start-up";
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
            className={`rounded-lg border px-3.5 py-2 text-sm transition-colors ${
              active
                ? "border-slate-900 font-semibold text-slate-900"
                : "border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function CheckboxOption<T extends string>({
  label,
  active,
  onClick,
}: {
  label: T;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-base text-slate-800"
    >
      {label}
      <span
        className={`flex h-5 w-5 items-center justify-center rounded border ${
          active ? "border-slate-900 bg-slate-900" : "border-slate-400 bg-white"
        }`}
      >
        {active && (
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-white" strokeWidth={2}>
            <path d="M3.5 8.5l3 3 6-6.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  );
}

function WhatsAppOfferForm({ packageName, packagePrice, onClose }: WhatsAppOfferFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [meeting, setMeeting] = useState<MeetingAnswer | null>(null);
  const [publicOffice, setPublicOffice] = useState<PublicOfficeAnswer | null>(null);
  const [timeline, setTimeline] = useState<LaunchTimeline | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const isValid = Boolean(name.trim() && email.trim() && meeting && publicOffice && industry);

  const handleSubmit = () => {
    if (!isValid) {
      setShowErrors(true);
      return;
    }

    const lines = [
      `Hi Skytech Ghana, I'd like to select the ${packageName} (${packagePrice}).`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      `Can we arrange a meeting: ${meeting}`,
      `Public office address: ${publicOffice}`,
      timeline ? `Launch timeline: ${timeline}` : null,
      `Industry: ${industry}`,
    ].filter(Boolean);

    const message = lines.join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    onClose();
  };

  const errorRing = (invalid: boolean) =>
    showErrors && invalid ? "border-red-300" : "border-emerald-200";

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
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name *"
            className={`w-full rounded-full border bg-transparent px-4 py-2.5 text-center outline-none focus:border-slate-400 ${errorRing(
              !name.trim()
            )}`}
          />
        </div>

        <div>
          <input
            type="email"
            value={email}
            placeholder="Your Email *"
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full rounded-full border bg-transparent px-4 py-2.5 text-center outline-none focus:border-slate-400 ${errorRing(
              !email.trim()
            )}`}
          />
        </div>

        <div>
          <p className="mb-2 text-base text-slate-800 text-center">
            Can we arrange a meeting with you? <RequiredMark />
          </p>
          <div className="flex justify-center gap-8">
            <CheckboxOption label="Yes" active={meeting === "Yes"} onClick={() => setMeeting("Yes")} />
            <CheckboxOption label="No" active={meeting === "No"} onClick={() => setMeeting("No")} />
          </div>
        </div>

        <div>
          <p className="mb-2 text-base text-slate-800 text-center">
            Do you have a public office address? <RequiredMark />
          </p>
          <div className="flex justify-center gap-6">
            <CheckboxOption
              label="Yes"
              active={publicOffice === "Yes"}
              onClick={() => setPublicOffice("Yes")}
            />
            <CheckboxOption
              label="No"
              active={publicOffice === "No"}
              onClick={() => setPublicOffice("No")}
            />
            <CheckboxOption
              label="Start-up"
              active={publicOffice === "Start-up"}
              onClick={() => setPublicOffice("Start-up")}
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-base text-slate-800 text-center">
            How soon do you plan to launch a website?
          </p>
          <PillGroup options={TIMELINES} value={timeline} onChange={setTimeline} />
        </div>

        <div>
          <p className="mb-2 text-base text-slate-800">
            What industry do you operate? <RequiredMark />
          </p>
          <PillGroup options={INDUSTRIES} value={industry} onChange={setIndustry} />
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
          className="flex-2 rounded-lg bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Open on What&apos;s App
        </button>
      </div>
    </div>
  );
}

export default WhatsAppOfferForm;
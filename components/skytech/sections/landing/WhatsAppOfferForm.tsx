"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChoiceList, ConversationalForm, type ConversationalStep } from "@/components/skytech/ui/ConversationalForm";
import { LEAD_INDUSTRIES, LEAD_SERVICES } from "@/lib/crm-options";
import { WHATSAPP_NUMBER } from "@/app/lib/whatsapp";
import { WA_THANKYOU_KEY } from "@/app/lib/waThankYou";
import { trackGtagLead } from "@/app/lib/gtag";

interface WhatsAppOfferFormProps {
  packageName?: string;
  packagePrice?: string;
  onClose?: () => void;
  whatsappNumber?: string;
  /** Hide the Return button (e.g. embedded on the contact page). */
  showReturn?: boolean;
  /** Override the line under "Well done!" */
  subtitle?: string;
  /** Show the green WhatsApp chat label under the subtitle. */
  showWhatsAppLabel?: boolean;
  /** Kept so existing pages can pass it. The form always asks the same required details. */
  extended?: boolean;
}

const DEFAULT_WHATSAPP = WHATSAPP_NUMBER;

const COUNTRY_CODES = [
  { code: "+233", label: "GH +233", flag: "🇬🇭" },
  { code: "+234", label: "NG +234", flag: "🇳🇬" },
  { code: "+254", label: "KE +254", flag: "🇰🇪" },
  { code: "+1", label: "US +1", flag: "🇺🇸" },
  { code: "+44", label: "UK +44", flag: "🇬🇧" },
  { code: "+27", label: "ZA +27", flag: "🇿🇦" },
  { code: "+91", label: "IN +91", flag: "🇮🇳" },
  { code: "+971", label: "AE +971", flag: "🇦🇪" },
];

function emailOk(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function WhatsAppOfferForm({
  packageName,
  packagePrice,
  onClose,
  whatsappNumber = DEFAULT_WHATSAPP,
  showReturn = true,
  subtitle = "One last step to get on",
  showWhatsAppLabel = true,
}: WhatsAppOfferFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code);
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState<(typeof LEAD_INDUSTRIES)[number] | null>(null);
  const [offering, setOffering] = useState<(typeof LEAD_SERVICES)[number] | null>(null);
  const [activity, setActivity] = useState("");
  const [sending, setSending] = useState(false);

  const phoneDigits = phone.replace(/[^\d]/g, "");
  const phoneOk = phoneDigits.length >= 7;
  const fullPhone = `${countryCode}${phoneDigits}`;
  const isValid = Boolean(
    name.trim() && emailOk(email) && phoneOk && company.trim() && industry && offering,
  );
  const advance = () => setStep((current) => current + 1);

  const fieldClass =
    "w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3.5 text-base text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

  const steps: ConversationalStep[] = [
    {
      id: "name",
      question: "What is your name?",
      valid: Boolean(name.trim()),
      body: (
        <input
          type="text"
          value={name}
          autoComplete="name"
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className={fieldClass}
        />
      ),
    },
    {
      id: "email",
      question: "What is your email?",
      valid: emailOk(email),
      body: (
        <div>
          <input
            type="email"
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            className={fieldClass}
          />
          {email.trim() && !emailOk(email) && (
            <p className="mt-2 text-sm text-red-600">Enter a valid email.</p>
          )}
        </div>
      ),
    },
    {
      id: "contact",
      question: "What number can we reach you on?",
      hint: "Include your WhatsApp number.",
      valid: phoneOk,
      body: (
        <div>
          <div className="flex overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100">
            <label className="sr-only" htmlFor="wa-country-code">
              Country code
            </label>
            <select
              id="wa-country-code"
              value={countryCode}
              onChange={(event) => setCountryCode(event.target.value)}
              className="max-w-[8.5rem] shrink-0 border-0 border-r border-emerald-100 bg-emerald-50/70 px-2 py-3.5 text-sm text-slate-800 outline-none"
            >
              {COUNTRY_CODES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.label}
                </option>
              ))}
            </select>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              autoComplete="tel-national"
              onChange={(event) => setPhone(event.target.value.replace(/[^\d\s-]/g, ""))}
              placeholder="Phone number"
                className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3.5 text-base text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
          {phone.trim() && !phoneOk && (
            <p className="mt-2 text-sm text-red-600">Enter at least 7 digits.</p>
          )}
        </div>
      ),
    },
    {
      id: "offering",
      question: "What do you want?",
      valid: Boolean(offering),
      body: (
        <ChoiceList
          accent="emerald"
          options={LEAD_SERVICES}
          value={offering}
          onChange={(value) => {
            setOffering(value);
            advance();
          }}
        />
      ),
    },
    {
      id: "company",
      question: "What company is this for?",
      valid: Boolean(company.trim()),
      body: (
        <input
          type="text"
          value={company}
          autoComplete="organization"
          onChange={(event) => setCompany(event.target.value)}
          placeholder="Company name"
          className={fieldClass}
        />
      ),
    },
    {
      id: "industry",
      question: "Which industry is this for?",
      valid: Boolean(industry),
      body: (
        <ChoiceList
          accent="emerald"
          options={LEAD_INDUSTRIES}
          value={industry}
          onChange={(value) => {
            setIndustry(value);
            advance();
          }}
        />
      ),
    },
    {
      id: "activity",
      question: "Anything else you'd like us to know?",
      hint: "This part is optional. Share a few words, or skip it and finish.",
      optional: true,
      valid: true,
      body: (
        <textarea
          value={activity}
          rows={4}
          onChange={(event) => setActivity(event.target.value)}
          placeholder="Tell us what you have in mind…"
          className={`${fieldClass} min-h-28 resize-y`}
        />
      ),
    },
  ];

  const handleSubmit = async () => {
    if (!isValid || sending) return;

    const interestLine = packageName
      ? `Hi Skytech Ghana, I'd like to select the *${packageName}${packagePrice ? ` (${packagePrice})` : ""}*.\n`
      : `Hi Skytech Ghana, I'd like to chat about your services.\n`;

    const message = [
      interestLine,
      ``,
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `Contact: ${fullPhone}`,
      `Company: ${company.trim()}`,
      `Industry: ${industry}`,
      `Service: ${offering}`,
      activity.trim() ? `Activity: ${activity.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const source = typeof window !== "undefined" ? window.location.pathname : "/forms";

    trackGtagLead({
      eventLabel: source === "/forms" ? "forms_lead_submit" : "lead_submit",
      eventCategory: "contact",
      pagePath: source,
    });

    const leadPayload = {
      name: name.trim(),
      phone: fullPhone,
      email: email.trim(),
      company: company.trim(),
      description: activity.trim(),
      industry: industry || "",
      service: offering || "",
      building: offering || "",
      projectType: packageName || "",
      budget: packagePrice || "",
      timeline: "",
      urgency: "",
      coupon: "",
      couponLabel: "",
      referral: "",
      packageName: packageName || "",
      packagePrice: packagePrice || "",
      source,
      message,
    };

    const crmBackendUrl = process.env.NEXT_PUBLIC_CRM_BACKEND_URL?.replace(/\/$/, "");
    const sameOrigin =
      typeof window !== "undefined" &&
      Boolean(crmBackendUrl) &&
      crmBackendUrl === window.location.origin;
    const crmRequests = [
      fetch("/api/v1/public/landing-page-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload),
      }).catch((error) => console.error("Failed to save lead:", error)),
    ];
    if (crmBackendUrl && !sameOrigin) {
      crmRequests.push(
        fetch(`${crmBackendUrl}/api/v1/public/landing-page-leads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadPayload),
        }).catch((error) => console.error("Failed to save lead to CRM:", error)),
      );
    }

    setSending(true);
    try {
      await Promise.allSettled([
        fetch("/api/content/contact-submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadPayload),
        }),
        ...crmRequests,
        fetch("/api/sms/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            recipients: [whatsappNumber],
          }),
        }),
      ]);
    } catch (error) {
      console.error("Failed to save lead / send SMS:", error);
    } finally {
      setSending(false);
    }

    try {
      sessionStorage.setItem(
        WA_THANKYOU_KEY,
        JSON.stringify({
          message,
          number: whatsappNumber,
          name: name.trim(),
        }),
      );
    } catch {
      // ignore storage failures
    }

    onClose?.();
    router.push("/thank-you");
  };

  return (
    <ConversationalForm
      steps={steps}
      index={step}
      onIndexChange={setStep}
      onSubmit={() => void handleSubmit()}
      submitting={sending}
      submitLabel="Submit"
      intro={
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Skytech Ghana</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">We&apos;re glad you&apos;re here</h2>
          <p className="mt-2 text-base leading-relaxed text-slate-600">{subtitle}</p>
          {showWhatsAppLabel && (
            <p className="flex items-center justify-center gap-1.5 text-lg font-bold text-emerald-600">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-emerald-600">
                <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .9.9-2.9-.2-.3A8 8 0 1112 20zm4.4-5.9c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 4 3.4.6.2 1 .4 1.3.5.6.2 1.1.1 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1 0-.1-.2-.2-.4-.3z" />
              </svg>
              What&apos;sApp chat
            </p>
          )}
        </div>
      }
      footerNote={
        showReturn && onClose ? (
          <button type="button" onClick={onClose} className="font-semibold text-slate-600">
            Return
          </button>
        ) : null
      }
    />
  );
}

export default WhatsAppOfferForm;

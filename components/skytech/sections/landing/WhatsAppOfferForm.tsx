"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WHATSAPP_NUMBER } from "@/app/lib/whatsapp";
import { WA_THANKYOU_KEY } from "@/app/lib/waThankYou";
import { lookupCoupon, type CouponOffer } from "@/app/lib/coupons";

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
  /** Extra fields used on /forms (what you're building, project type, budget, phone). */
  extended?: boolean;
}

const DEFAULT_WHATSAPP = WHATSAPP_NUMBER;

type Urgency = "Very urgent" | "Urgent" | "Soon";
type Building = "Website + SEO" | "Mobile App" | "Both";
type ProjectType = "New Build" | "Redesign / Upgrade";
type Budget =
  | "Promo GH₵2,500"
  | "GH₵6,500"
  | "GH₵6,500 – GH₵12,000"
  | "GH₵12,000+";
type ReferralSource = "TikTok" | "Google" | "Facebook" | "Instagram" | "Friends" | "Other";

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

const URGENCY_OPTIONS: Urgency[] = ["Very urgent", "Urgent", "Soon"];
const BUILDING_OPTIONS: Building[] = ["Website + SEO", "Mobile App", "Both"];
const PROJECT_TYPE_OPTIONS: ProjectType[] = ["New Build", "Redesign / Upgrade"];
const BUDGET_OPTIONS: Budget[] = [
  "Promo GH₵2,500",
  "GH₵6,500",
  "GH₵6,500 – GH₵12,000",
  "GH₵12,000+",
];
const REFERRAL_OPTIONS: ReferralSource[] = [
  "TikTok",
  "Google",
  "Facebook",
  "Instagram",
  "Friends",
  "Other",
];

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

/** Budget bands aligned to typical website vs app vs combined scopes. */
function budgetsForBuilding(building: Building | null): Budget[] {
  if (!building) return [];
  if (building === "Website + SEO") {
    return ["Promo GH₵2,500", "GH₵6,500", "GH₵12,000+"];
  }
  if (building === "Mobile App") {
    return ["GH₵6,500 – GH₵12,000", "GH₵12,000+"];
  }
  // Both website and app — higher scope
  return ["GH₵12,000+"];
}

function urgencyQuestion(building: Building | null, projectType: ProjectType | null) {
  if (!building) return "How urgent do you need a digital solution?";
  if (projectType) return `How urgent do you need your ${building} (${projectType})?`;
  return `How urgent do you need your ${building}?`;
}

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
  showReturn = true,
  subtitle = "One last step to get on",
  showWhatsAppLabel = true,
  extended = false,
}: WhatsAppOfferFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code);
  const [phone, setPhone] = useState("");
  const [building, setBuilding] = useState<Building | null>(null);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [urgency, setUrgency] = useState<Urgency | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponOffer | null>(null);
  const [couponError, setCouponError] = useState("");
  const [referral, setReferral] = useState<ReferralSource | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [sending, setSending] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const buildingRef = useRef<HTMLDivElement | null>(null);
  const projectTypeRef = useRef<HTMLDivElement | null>(null);
  const budgetRef = useRef<HTMLDivElement | null>(null);
  const industryRef = useRef<HTMLDivElement | null>(null);
  const referralRef = useRef<HTMLDivElement | null>(null);

  const phoneDigits = phone.replace(/[^\d]/g, "");
  const phoneOk = phoneDigits.length >= 7;
  const fullPhone = `${countryCode}${phoneDigits}`;
  const availableBudgets = budgetsForBuilding(building);
  const promoBudgetSelected = budget === "Promo GH₵2,500";
  const isValid = extended
    ? Boolean(name.trim() && phoneOk && building && projectType && budget && industry && referral)
    : Boolean(name.trim() && industry);

  const selectBuilding = (next: Building) => {
    setBuilding(next);
    const nextBudgets = budgetsForBuilding(next);
    setBudget((current) => (current && nextBudgets.includes(current) ? current : null));
  };

  const selectBudget = (next: Budget) => {
    setBudget(next);
    if (next === "Promo GH₵2,500") {
      setCouponInput("");
      setAppliedCoupon(null);
      setCouponError("");
    }
  };

  const onCouponChange = (raw: string) => {
    const value = raw.toUpperCase();
    setCouponInput(value);
    if (!value.trim()) {
      setAppliedCoupon(null);
      setCouponError("");
      return;
    }
    const offer = lookupCoupon(value);
    if (offer) {
      setAppliedCoupon(offer);
      setCouponError("");
    } else {
      setAppliedCoupon(null);
      setCouponError(value.trim().length >= 6 ? "That code is not valid." : "");
    }
  };

  const scrollToFirstInvalidField = () => {
    const firstInvalidField = !name.trim()
      ? nameRef.current
      : extended && !phoneOk
        ? phoneRef.current
        : extended && !building
          ? buildingRef.current
          : extended && !projectType
            ? projectTypeRef.current
            : extended && !budget
              ? budgetRef.current
              : !industry
                ? industryRef.current
                : extended && !referral
                  ? referralRef.current
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
      extended && phoneOk ? `Number: ${fullPhone}` : null,
      extended && building ? `Building: ${building}` : null,
      extended && projectType ? `Project type: ${projectType}` : null,
      extended && budget ? `Budget: ${budget}` : null,
      extended && appliedCoupon && !promoBudgetSelected
        ? `Coupon: ${appliedCoupon.code} (${appliedCoupon.label})`
        : null,
      urgency ? `Urgency: ${urgency}` : null,
      `Industry: ${industry}`,
      extended && referral ? `Heard about us: ${referral}` : null,
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

  const errorRing = (invalid: boolean) => (showErrors && invalid ? "border-red-300" : "border-slate-200");

  return (
    <div className="text-center">
      <h2 className="text-2xl mt-2 font-bold text-slate-800">Well done!</h2>
      <p className="text-lg text-slate-600">{subtitle}</p>
      {showWhatsAppLabel && (
        <p className="flex items-center justify-center gap-1.5 text-lg font-bold text-emerald-600">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-emerald-600">
            <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .9.9-2.9-.2-.3A8 8 0 1112 20zm4.4-5.9c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 4 3.4.6.2 1 .4 1.3.5.6.2 1.1.1 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1 0-.1-.2-.2-.4-.3z" />
          </svg>
          What&apos;sApp chat
        </p>
      )}

      <div className="mt-8 space-y-6 text-left">
        <div>
          <input
            ref={nameRef}
            type="text"
            value={name}
            autoComplete="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={`w-full rounded-lg border bg-transparent px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-500 focus:border-slate-900 ${errorRing(!name.trim())}`}
          />
        </div>

        {extended && (
          <>
            <div>
              <div
                className={`flex overflow-hidden rounded-lg border ${errorRing(!phoneOk)}`}
              >
                <label className="sr-only" htmlFor="wa-country-code">
                  Country code
                </label>
                <select
                  id="wa-country-code"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="max-w-[8.5rem] shrink-0 border-0 border-r border-slate-200 bg-slate-50 px-2 py-2.5 text-sm text-slate-800 outline-none focus:bg-white"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.label}
                    </option>
                  ))}
                </select>
                <input
                  ref={phoneRef}
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  autoComplete="tel-national"
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, ""))}
                  placeholder="Number"
                  className="min-w-0 flex-1 border-0 bg-transparent px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div ref={buildingRef}>
              <p className="mb-2 text-base text-slate-800">
                What are you building? <RequiredMark />
              </p>
              <PillGroup options={BUILDING_OPTIONS} value={building} onChange={selectBuilding} />
            </div>

            <div ref={projectTypeRef}>
              <p className="mb-2 text-base text-slate-800">
                Is this a new project? <RequiredMark />
              </p>
              <PillGroup options={PROJECT_TYPE_OPTIONS} value={projectType} onChange={setProjectType} />
            </div>

            <div ref={budgetRef}>
              <p className="mb-2 text-base text-slate-800">
                Select your estimated budget: <RequiredMark />
              </p>
              {!building ? (
                <p className="text-sm text-slate-500">Select what you&apos;re building to see matching budgets.</p>
              ) : (
                <PillGroup options={availableBudgets} value={budget} onChange={selectBudget} />
              )}
            </div>

            <div
              className={
                promoBudgetSelected
                  ? "pointer-events-none select-none opacity-45"
                  : undefined
              }
              aria-disabled={promoBudgetSelected}
            >
              <p
                className={`mb-2 text-base text-slate-800 ${
                  promoBudgetSelected ? "line-through decoration-slate-400" : ""
                }`}
              >
                Have a coupon code?
              </p>
              <input
                type="text"
                value={promoBudgetSelected ? "" : couponInput}
                onChange={(e) => onCouponChange(e.target.value)}
                placeholder="Enter code"
                disabled={promoBudgetSelected}
                className={`w-full rounded-lg border bg-transparent px-3.5 py-2.5 text-sm uppercase tracking-wide text-slate-800 outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-500 focus:border-slate-900 disabled:cursor-not-allowed ${
                  promoBudgetSelected
                    ? "border-slate-200 line-through decoration-slate-400"
                    : appliedCoupon
                      ? "border-emerald-400"
                      : couponError
                        ? "border-red-300"
                        : "border-slate-200"
                }`}
              />
              {promoBudgetSelected ? (
                <p className="mt-2 text-sm text-slate-500">
                  Promo pricing already includes a discount — coupons don&apos;t apply.
                </p>
              ) : (
                <>
                  {appliedCoupon && (
                    <p className="mt-2 text-sm font-medium text-emerald-700">
                      Coupon applied — {appliedCoupon.label} on your project.
                    </p>
                  )}
                  {couponError && (
                    <p className="mt-2 text-sm text-red-600">{couponError}</p>
                  )}
                </>
              )}
            </div>
          </>
        )}

        <div>
          <p className="mb-2 text-base text-slate-800">
            {extended ? urgencyQuestion(building, projectType) : "How urgent do you need a digital solution?"}
          </p>
          <PillGroup options={URGENCY_OPTIONS} value={urgency} onChange={setUrgency} />
        </div>

        <div>
          <div ref={industryRef}>
            <p className="mb-2 text-base text-slate-800">
              Which industry best describes your business? <RequiredMark />
            </p>
            <PillGroup options={INDUSTRIES} value={industry} onChange={setIndustry} />
          </div>
        </div>

        {extended && (
          <div ref={referralRef}>
            <p className="mb-2 text-base text-slate-800">
              Where did you hear about us? <RequiredMark />
            </p>
            <PillGroup options={REFERRAL_OPTIONS} value={referral} onChange={setReferral} />
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center gap-3">
        {showReturn && onClose && (
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
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || sending}
          className={`${showReturn && onClose ? "flex-[2]" : "w-full"} rounded-lg py-3 font-semibold text-white transition-colors ${isValid && !sending ? "bg-emerald-600 hover:bg-emerald-700" : "cursor-not-allowed bg-emerald-300 text-white/80"
            }`}
        >
          {sending ? "Sending..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default WhatsAppOfferForm;

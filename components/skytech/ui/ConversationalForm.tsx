"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";

export type ConversationalStep = {
  id: string;
  question: string;
  hint?: string;
  optional?: boolean;
  valid: boolean;
  body: ReactNode;
};

export function ChoiceList<T extends string>({
  options,
  value,
  onChange,
  accent = "slate",
}: {
  options: readonly T[];
  value: T | null;
  onChange: (value: T) => void;
  accent?: "emerald" | "slate";
}) {
  return (
    <div className="space-y-2.5">
      {options.map((option) => {
        const active = value === option;
        const warm = accent === "emerald";
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm transition ${
              active
                ? warm
                  ? "border-emerald-600 bg-emerald-600 font-semibold text-white shadow-md shadow-emerald-600/25"
                  : "border-slate-900 bg-slate-900 font-semibold text-white"
                : warm
                  ? "border-emerald-100 bg-white text-slate-800 shadow-sm hover:border-emerald-300 hover:bg-emerald-50"
                  : "border-slate-200 text-slate-700 hover:border-slate-400"
            }`}
          >
            <span>{option}</span>
            {active && <span aria-hidden="true">✓</span>}
          </button>
        );
      })}
    </div>
  );
}

export function ConversationalForm({
  steps,
  index,
  onIndexChange,
  onSubmit,
  submitting = false,
  submitLabel,
  intro,
  footerNote,
  accent = "emerald",
}: {
  steps: ConversationalStep[];
  index: number;
  onIndexChange: (index: number) => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitLabel: string;
  intro?: ReactNode;
  footerNote?: ReactNode;
  accent?: "emerald" | "slate";
}) {
  const safeIndex = Math.min(Math.max(index, 0), Math.max(steps.length - 1, 0));
  const step = steps[safeIndex];
  const last = safeIndex >= steps.length - 1;
  const progress = steps.length ? ((safeIndex + 1) / steps.length) * 100 : 0;
  const bodyRef = useRef<HTMLDivElement>(null);
  const armedStep = useRef<string | null>(null);
  const [blockedStep, setBlockedStep] = useState<string | null>(null);
  const blocked = blockedStep === step.id;
  const canContinue = step.valid || Boolean(step.optional);

  useEffect(() => {
    const field = bodyRef.current?.querySelector<HTMLElement>(
      "input:not([type=file]):not([type=hidden]), textarea, select",
    );
    field?.focus();
  }, [step?.id]);

  if (!step) return null;

  const goNext = () => {
    if (armedStep.current !== step.id) return;
    if (!canContinue) {
      setBlockedStep(step.id);
      return;
    }
    if (last) onSubmit();
    else onIndexChange(safeIndex + 1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    const target = event.target as HTMLElement;
    if (target.tagName === "TEXTAREA") return;
    armedStep.current = step.id;
    event.preventDefault();
    goNext();
  };

  const warm = accent === "emerald";
  const primary = warm
    ? "bg-emerald-600 shadow-lg shadow-emerald-600/25 hover:bg-emerald-700"
    : "bg-slate-950 hover:bg-slate-900";

  return (
    <form
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        goNext();
      }}
      onKeyDown={onKeyDown}
    >
      {intro}
      <div className="mt-6">
        <div className={`mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-[0.16em] ${warm ? "text-emerald-700" : "text-slate-500"}`}>
          <span>
            Step {safeIndex + 1} of {steps.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className={`h-2 overflow-hidden rounded-full ${warm ? "bg-emerald-100" : "bg-slate-100"}`}>
          <div
            className={`h-full rounded-full transition-all ${warm ? "bg-gradient-to-r from-emerald-400 to-emerald-600" : "bg-slate-900"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-8 text-left">
        <h3 className={`font-semibold tracking-tight text-slate-900 ${warm ? "text-2xl leading-snug" : "text-xl"}`}>
          {step.question}
        </h3>
        {step.hint && (
          <p className={`mt-2 text-sm leading-relaxed ${warm ? "text-slate-600" : "text-slate-500"}`}>
            {step.hint}
          </p>
        )}
        <div ref={bodyRef} className="mt-4">
          {step.body}
        </div>
        {blocked && !canContinue && (
          <p className="mt-3 text-sm text-red-600">Answer this to continue.</p>
        )}
      </div>

      <div className="mt-8 flex items-center gap-3">
        {safeIndex > 0 && (
          <button
            type="button"
            onPointerDown={() => {
              armedStep.current = step.id;
            }}
            onClick={() => onIndexChange(safeIndex - 1)}
            className={`rounded-2xl border px-4 py-3 font-semibold ${warm ? "border-emerald-100 bg-white text-slate-700" : "border-slate-300 text-slate-800"}`}
          >
            Back
          </button>
        )}
        {step.optional && (
          <button
            type="button"
            onClick={() => (last ? onSubmit() : onIndexChange(safeIndex + 1))}
            disabled={submitting}
            className={`rounded-2xl px-4 py-3 font-semibold ${warm ? "text-emerald-800 hover:bg-emerald-50" : "border border-slate-300 text-slate-600"}`}
          >
            {last ? "Skip and finish" : "Skip"}
          </button>
        )}
        <button
          type="submit"
          onPointerDown={() => {
            armedStep.current = step.id;
          }}
          disabled={submitting || (!canContinue && blocked)}
          className={`flex-1 rounded-2xl py-3.5 font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none ${
            canContinue && !submitting ? primary : "bg-slate-300"
          }`}
        >
          {submitting ? "Sending..." : last ? submitLabel : "Continue"}
        </button>
      </div>
      {footerNote && <div className="mt-4 text-center text-sm text-slate-500">{footerNote}</div>}
    </form>
  );
}

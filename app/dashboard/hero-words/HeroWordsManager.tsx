"use client";

import { useState } from "react";
import {
  DEFAULT_HERO_WORDS,
  type HeroWordsContent,
} from "@/app/lib/hero-words-shared";
import { updateHeroWordsAction } from "@/app/admin/actions";

export default function HeroWordsManager({
  initialContent,
}: {
  initialContent: HeroWordsContent;
}) {
  const [words, setWords] = useState<string[]>(initialContent.words);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function persist(next: string[]) {
    setLoading(true);
    setMessage("");
    const result = await updateHeroWordsAction({ words: next });
    if (result.success) {
      setMessage("Hero words updated.");
      setTimeout(() => setMessage(""), 2500);
    } else {
      setMessage("Error: " + result.error);
    }
    setLoading(false);
  }

  function updateWord(index: number, value: string) {
    setWords((prev) => prev.map((word, i) => (i === index ? value : word)));
  }

  function addWord() {
    setWords((prev) => [...prev, ""]);
  }

  function removeWord(index: number) {
    if (words.length <= 1) {
      setMessage("Keep at least one word.");
      return;
    }
    setWords((prev) => prev.filter((_, i) => i !== index));
  }

  function moveWord(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= words.length) return;
    setWords((prev) => {
      const next = [...prev];
      const [row] = next.splice(index, 1);
      next.splice(target, 0, row);
      return next;
    });
  }

  function resetDefaults() {
    if (!confirm("Reset to big / Better / Massive?")) return;
    setWords([...DEFAULT_HERO_WORDS.words]);
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hero words</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            These rotate inside the blue pill on the homepage hero — after &quot;your next&quot;.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addWord}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Add word
          </button>
          <button
            type="button"
            onClick={resetDefaults}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Reset defaults
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void persist(words)}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {message ? (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${
            message.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </p>
      ) : null}

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        {words.map((word, index) => (
          <div key={`word-${index}`} className="flex flex-wrap items-center gap-2">
            <span className="w-8 text-xs font-semibold text-slate-400">{String(index + 1).padStart(2, "0")}</span>
            <input
              value={word}
              onChange={(event) => updateWord(index, event.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900"
              placeholder="Word shown in the blue pill"
            />
            <button
              type="button"
              aria-label="Move up"
              onClick={() => moveWord(index, -1)}
              className="rounded-lg px-2 py-2 text-sm text-slate-500 hover:bg-slate-100"
            >
              ↑
            </button>
            <button
              type="button"
              aria-label="Move down"
              onClick={() => moveWord(index, 1)}
              className="rounded-lg px-2 py-2 text-sm text-slate-500 hover:bg-slate-100"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => removeWord(index)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#f6f6f4] px-6 py-8">
        <p className="text-center text-sm text-slate-500">Preview</p>
        <p className="mt-3 text-center font-serif text-3xl font-medium tracking-tight text-slate-900 md:text-4xl">
          your next{" "}
          <span className="inline-flex rounded-full bg-[#b7dff6] px-3 py-0.5">
            {words.find((word) => word.trim()) || "…"}
          </span>
        </p>
        <p className="mt-3 text-center text-xs text-slate-500">
          Order on site: {words.filter(Boolean).join(" → ") || "—"}
        </p>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { updateHomeHero } from "../../admin/actions";

interface StatRow {
  value: number;
  suffix: string;
  label: string;
  compact: boolean;
}

export default function HeroForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentHero, setCurrentHero] = useState({
    headline: initialData?.headline ?? "MANY YEARS",
    headlineSub: initialData?.headlineSub ?? "IN OPERATION",
    subText: initialData?.subText ?? "For Website, Mobile App Development and SEO Growth",
    imageUrl: initialData?.imageUrl ?? "",
    stats: Array.isArray(initialData?.stats) && initialData.stats.length > 0
      ? initialData.stats
      : [
          { value: 8, suffix: "+", label: "Years in Operation", compact: false },
          { value: 8, suffix: "+", label: "Satisfied Customers", compact: false },
          { value: 1000, suffix: "+", label: "Projects Completed", compact: true },
          { value: 4, suffix: "+", label: "Countries Served", compact: false },
        ],
  });

  function updateStat(index: number, field: keyof StatRow, value: any) {
    setCurrentHero((prev) => {
      const stats = prev.stats.map((s: StatRow, i: number) =>
        i === index ? { ...s, [field]: value } : s
      );
      return { ...prev, stats };
    });
  }

  function addStat() {
    setCurrentHero((prev) => ({
      ...prev,
      stats: [...prev.stats, { value: 0, suffix: "+", label: "", compact: false }],
    }));
  }

  function removeStat(index: number) {
    setCurrentHero((prev) => ({
      ...prev,
      stats: prev.stats.filter((_: StatRow, i: number) => i !== index),
    }));
  }

  async function handleSubmit(e: any) {
    if (e.preventDefault) e.preventDefault();
    setLoading(true);
    setMessage("");

    const target = e.target.form || e.target;
    const formData = new FormData(target);

    const payload = new FormData();
    payload.append("headline", currentHero.headline);
    payload.append("headlineSub", currentHero.headlineSub);
    payload.append("subText", currentHero.subText);
    payload.append("stats", JSON.stringify(currentHero.stats));
    payload.append("currentImageUrl", currentHero.imageUrl);
    const imageFile = formData.get("image");
    if (imageFile && (imageFile as File).size > 0) {
      payload.append("image", imageFile as File);
    }

    const result = await updateHomeHero(payload);

    if (result.success) {
      setMessage("Home Hero updated successfully.");
      if (result.imageUrl) {
        setCurrentHero((prev: any) => ({ ...prev, imageUrl: result.imageUrl }));
      }
    } else {
      setMessage("Error updating Hero: " + result.error);
    }
    setLoading(false);
  }

  const triggerUpload = () => {
    document.getElementById("hero-upload")?.click();
  };

  const inputClass =
    "w-full p-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-900";
  const labelClass =
    "text-[10px] font-black uppercase tracking-widest text-slate-400 px-1";

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm space-y-8">
      {message && (
        <div
          className={`p-5 rounded-2xl text-sm font-bold ${
            message.includes("Error")
              ? "bg-red-50 text-red-600 border border-red-100"
              : "bg-green-50 text-green-600 border border-green-100"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="space-y-2">
            <label className={labelClass}>Headline - Line 1</label>
            <input
              name="headline"
              value={currentHero.headline}
              onChange={(e) => setCurrentHero({ ...currentHero, headline: e.target.value })}
              className={inputClass}
              placeholder="MANY YEARS"
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Headline - Line 2</label>
            <input
              name="headlineSub"
              value={currentHero.headlineSub}
              onChange={(e) => setCurrentHero({ ...currentHero, headlineSub: e.target.value })}
              className={inputClass}
              placeholder="IN OPERATION"
            />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <label className={labelClass}>Text Under Buttons</label>
          <textarea
            name="subText"
            value={currentHero.subText}
            onChange={(e) => setCurrentHero({ ...currentHero, subText: e.target.value })}
            className={`${inputClass} min-h-[80px] font-medium text-slate-600`}
            placeholder="For Website, Mobile App Development and SEO Growth"
          />
        </div>

        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between">
            <label className={labelClass}>Counts / Stats</label>
            <button
              type="button"
              onClick={addStat}
              className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
            >
              + Add Stat
            </button>
          </div>
          {currentHero.stats.map((s: StatRow, index: number) => (
            <div key={index} className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <input
                type="number"
                value={s.value}
                onChange={(e) => updateStat(index, "value", Number(e.target.value))}
                className="w-24 p-2.5 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                placeholder="8"
              />
              <input
                value={s.suffix}
                onChange={(e) => updateStat(index, "suffix", e.target.value)}
                className="w-16 p-2.5 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                placeholder="+"
              />
              <input
                value={s.label}
                onChange={(e) => updateStat(index, "label", e.target.value)}
                className="flex-1 min-w-[140px] p-2.5 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-700"
                placeholder="Years in Operation"
              />
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                <input
                  type="checkbox"
                  checked={!!s.compact}
                  onChange={(e) => updateStat(index, "compact", e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                Compact
              </label>
              <button
                type="button"
                onClick={() => removeStat(index)}
                className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all"
              >
                Remove
              </button>
            </div>
          ))}
          {currentHero.stats.length === 0 && (
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 text-left">
              No stats added yet.
            </p>
          )}
        </div>

        <div className="space-y-2 text-left">
          <label className={labelClass}>Background Image</label>
          <input
            type="file"
            id="hero-upload"
            name="image"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (re) =>
                  setCurrentHero({ ...currentHero, imageUrl: re.target?.result as string });
                reader.readAsDataURL(file);
              }
            }}
          />

          <div
            onClick={triggerUpload}
            className="relative aspect-video rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl cursor-pointer group hover:scale-[1.01] transition-all duration-500 bg-slate-100"
          >
            {currentHero.imageUrl ? (
              <img src={currentHero.imageUrl} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-black uppercase tracking-widest">
                No Image Set
              </div>
            )}

            <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-300">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-black uppercase tracking-tighter text-xl">Change Image</span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-12 py-5 rounded-full font-black text-sm tracking-widest uppercase shadow-2xl transition-all ${
              loading
                ? "bg-slate-200 text-slate-400"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
            }`}
          >
            {loading ? "Updating Hero..." : "Save Hero Content"}
          </button>
        </div>
      </form>

      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
        Click the image to update the hero background
      </p>
    </div>
  );
}

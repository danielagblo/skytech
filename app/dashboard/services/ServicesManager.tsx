"use client";

import { useState } from "react";
import {
  DEFAULT_FILM_SERVICES,
  type FilmServiceItem,
  type FilmServiceStep,
  type FilmServicesContent,
  type ServiceMedia,
} from "@/app/lib/services-shared";
import { updateFilmServicesAction, uploadPartnerLogoAction } from "@/app/admin/actions";

const EMPTY_SERVICE: FilmServiceItem = {
  id: "",
  kicker: "",
  line: "",
  body: "",
  price: "",
  note: "",
  href: "/pricing",
  media: "mark",
  image: "",
  imageAlt: "",
  videoSrc: "/videos/virtual-tour.mp4",
};

const EMPTY_STEP: FilmServiceStep = {
  id: "",
  label: "",
  title: "",
  body: "",
};

export default function ServicesManager({ initialContent }: { initialContent: FilmServicesContent }) {
  const [content, setContent] = useState<FilmServicesContent>(initialContent);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeId, setActiveId] = useState(initialContent.services[0]?.id || "");

  const active = content.services.find((item) => item.id === activeId) || content.services[0];

  async function persist(next: FilmServicesContent) {
    setLoading(true);
    setMessage("");
    const result = await updateFilmServicesAction(next);
    if (result.success) {
      setMessage("Services page updated.");
      setTimeout(() => setMessage(""), 2500);
    } else {
      setMessage("Error: " + result.error);
    }
    setLoading(false);
  }

  function updateService(id: string, patch: Partial<FilmServiceItem>) {
    setContent((prev) => ({
      ...prev,
      services: prev.services.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  function updateStep(index: number, patch: Partial<FilmServiceStep>) {
    setContent((prev) => ({
      ...prev,
      steps: prev.steps.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  function addService() {
    const id = `service-${Date.now()}`;
    const next = {
      ...content,
      services: [...content.services, { ...EMPTY_SERVICE, id, kicker: "New service" }],
    };
    setContent(next);
    setActiveId(id);
  }

  function removeService(id: string) {
    if (!confirm("Remove this service from the services page?")) return;
    const services = content.services.filter((item) => item.id !== id);
    const next = { ...content, services };
    setContent(next);
    setActiveId(services[0]?.id || "");
    void persist(next);
  }

  function addStep() {
    const next = {
      ...content,
      steps: [
        ...content.steps,
        {
          ...EMPTY_STEP,
          id: `step-${Date.now()}`,
          label: String(content.steps.length + 1).padStart(2, "0"),
          title: "New step",
        },
      ],
    };
    setContent(next);
  }

  function removeStep(index: number) {
    if (!confirm("Remove this step?")) return;
    const next = {
      ...content,
      steps: content.steps.filter((_, i) => i !== index),
    };
    setContent(next);
    void persist(next);
  }

  async function handleImageUpload(file: File) {
    if (!active) return;
    const form = new FormData();
    form.append("file", file);
    setLoading(true);
    const result = await uploadPartnerLogoAction(form);
    if (result.success && result.imageUrl) {
      updateService(active.id, { image: result.imageUrl, media: "image" });
    }
    setLoading(false);
  }

  function resetDefaults() {
    if (!confirm("Reset services page copy to the current site defaults?")) return;
    setContent(DEFAULT_FILM_SERVICES);
    setActiveId(DEFAULT_FILM_SERVICES.services[0]?.id || "");
    void persist(DEFAULT_FILM_SERVICES);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Services page</h1>
          <p className="mt-2 text-slate-500">
            Edit the stacked services, pricing lines, media, and “How the work moves” steps on /services.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetDefaults}
            className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Reset defaults
          </button>
          <button
            type="button"
            onClick={() => persist(content)}
            disabled={loading}
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save services"}
          </button>
        </div>
      </div>

      {message ? (
        <div
          className={`rounded-2xl border p-4 text-sm font-semibold ${
            message.includes("Error")
              ? "border-red-100 bg-red-50 text-red-600"
              : "border-emerald-100 bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {content.services.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              item.id === active?.id ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {item.kicker || item.id}
          </button>
        ))}
        <button
          type="button"
          onClick={addService}
          className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
        >
          + Add service
        </button>
      </div>

      {active ? (
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">{active.kicker || "Service"}</h2>
            <button
              type="button"
              onClick={() => removeService(active.id)}
              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
            >
              Remove
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kicker</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium"
                value={active.kicker}
                onChange={(e) => updateService(active.id, { kicker: e.target.value })}
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Offer link</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium"
                value={active.href}
                onChange={(e) => updateService(active.id, { href: e.target.value })}
              />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Headline</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium"
                value={active.line}
                onChange={(e) => updateService(active.id, { line: e.target.value })}
              />
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Body</span>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium"
                value={active.body}
                onChange={(e) => updateService(active.id, { body: e.target.value })}
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price line</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium"
                value={active.price}
                onChange={(e) => updateService(active.id, { price: e.target.value })}
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Note</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium"
                value={active.note}
                onChange={(e) => updateService(active.id, { note: e.target.value })}
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Media</span>
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium"
                value={active.media}
                onChange={(e) => updateService(active.id, { media: e.target.value as ServiceMedia })}
              >
                <option value="mark">Mark / chevron</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image alt</span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium"
                value={active.imageAlt || ""}
                onChange={(e) => updateService(active.id, { imageAlt: e.target.value })}
              />
            </label>
            {active.media === "image" ? (
              <>
                <label className="space-y-2 text-sm md:col-span-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image URL</span>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium"
                    value={active.image || ""}
                    onChange={(e) => updateService(active.id, { image: e.target.value })}
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleImageUpload(file);
                    }}
                  />
                </label>
              </>
            ) : null}
            {active.media === "video" ? (
              <label className="space-y-2 text-sm md:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Video path</span>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium"
                  value={active.videoSrc || ""}
                  onChange={(e) => updateService(active.id, { videoSrc: e.target.value })}
                />
              </label>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">How the work moves</h2>
            <p className="text-sm text-slate-500">Steps shown after the service stack</p>
          </div>
          <button
            type="button"
            onClick={addStep}
            className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
          >
            + Add step
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {content.steps.map((step, index) => (
            <div key={step.id} className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <input
                  className="w-20 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold"
                  value={step.label}
                  onChange={(e) => updateStep(index, { label: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-xs font-semibold text-red-500"
                >
                  Remove
                </button>
              </div>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold"
                value={step.title}
                onChange={(e) => updateStep(index, { title: e.target.value })}
              />
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                value={step.body}
                onChange={(e) => updateStep(index, { body: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-6 flex justify-end">
        <button
          type="button"
          onClick={() => persist(content)}
          disabled={loading}
          className="rounded-full bg-slate-900 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-xl hover:bg-black disabled:opacity-60"
        >
          {loading ? "Saving…" : "Save services page"}
        </button>
      </div>
    </div>
  );
}

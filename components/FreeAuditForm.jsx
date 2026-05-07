"use client";

import { useMemo, useState } from "react";

function isValidUrl(value) {
  try {
    // Accept bare domains by coercing to https://
    const v = value.includes("://") ? value : `https://${value}`;
    // eslint-disable-next-line no-new
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

export default function FreeAuditForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const canSubmit = useMemo(() => {
    if (!name.trim()) return false;
    if (!email.trim()) return false;
    if (!website.trim()) return false;
    if (!isValidUrl(website.trim())) return false;
    return true;
  }, [name, email, website]);

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    try {
      await fetch("/api/content/contact-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: "",
          company: "",
          projectType: "Free Website Audit",
          budget: "",
          timeline: "",
          urgency: "Normal",
          message: `Website audit request.\nWebsite: ${website}`,
          website,
        }),
      });
      setDone(true);
    } catch (err) {
      // Keep it quiet; this is a lead-capture form and should not feel “broken”
      console.error("Audit form submit failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-bold text-emerald-900">Request received.</p>
        <p className="text-sm text-emerald-800 mt-1">
          We’ll review your website and reply with actionable improvements.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
          Full name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your name"
          autoComplete="name"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@company.com"
          autoComplete="email"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
          Website URL
        </label>
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="example.com"
          inputMode="url"
        />
        <p className="text-xs text-slate-500 mt-2">
          We’ll check speed, SEO basics, and quick wins.
        </p>
      </div>
      <button
        type="submit"
        disabled={!canSubmit || loading}
        className="btn-primary w-full disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {loading ? "Sending..." : "Get my free audit"}
      </button>
      <p className="text-xs text-slate-500">
        No spam. Just useful recommendations.
      </p>
    </form>
  );
}


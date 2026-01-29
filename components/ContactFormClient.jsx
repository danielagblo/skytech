"use client";
import { useState, useRef } from "react";

export default function ContactFormClient() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const form = new FormData(formRef.current);

      const res = await fetch("/api/content/contact-submissions", {
        method: "POST",
        body: form,
        credentials: "same-origin",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to submit");

      setSuccess(true);
      formRef.current.reset();
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {success && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl">
          Thank you! We'll get back to you soon.
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          Error: {error}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Name</label>
            <input name="name" type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Email</label>
            <input name="email" type="email" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white" placeholder="you@email.com" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Phone <span className="text-red-600">*</span></label>
            <input name="phone" type="tel" required className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white" placeholder="Your phone number" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Company <span className="text-slate-500 text-xs">(optional)</span></label>
            <input name="company" type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white" placeholder="Your company (optional)" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Project type <span className="text-slate-500 text-xs">(optional)</span></label>
            <select name="projectType" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white">
              <option value="">Select one (optional)</option>
              <option value="web">Web app / platform</option>
              <option value="mobile">Mobile app</option>
              <option value="cloud">Cloud / DevOps</option>
              <option value="data">Data / AI</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Budget (GHS)</label>
            <input name="budget" type="number" min="0" step="500" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white" placeholder="e.g., 50000" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Timeline</label>
            <select name="timeline" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white">
              <option value="">Select timeline</option>
              <option value="<1mo">Under 1 month</option>
              <option value="1-3mo">1–3 months</option>
              <option value="3-6mo">3–6 months</option>
              <option value="over-6mo">6+ months</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Urgency</label>
            <select name="urgency" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white">
              <option value="">How soon?</option>
              <option value="asap">Immediate</option>
              <option value="this-quarter">This quarter</option>
              <option value="next-quarter">Next quarter</option>
              <option value="exploring">Exploring options</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2">Project details</label>
          <textarea name="message" rows="5" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white" placeholder="What are you building? Timelines? Success metrics?"></textarea>
        </div>

        <button type="submit" disabled={submitting} className="w-full btn-primary justify-center">
          {submitting ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  );
}

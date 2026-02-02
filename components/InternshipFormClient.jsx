"use client";

import { useState, useRef } from "react";

export default function InternshipFormClient() {
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

      const res = await fetch("/api/content/internship-submissions", {
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
          Thank you! We will review your request and contact you.
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
            <label className="block text-sm font-semibold text-slate-800 mb-2">Full name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white"
              placeholder="you@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Phone</label>
            <input
              name="phone"
              type="tel"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white"
              placeholder="Your phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">School</label>
            <input
              name="school"
              type="text"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white"
              placeholder="Your school"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Program</label>
            <input
              name="program"
              type="text"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white"
              placeholder="Program / course"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Level / Year</label>
            <input
              name="level"
              type="text"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white"
              placeholder="e.g., Year 2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Start date</label>
            <input
              name="startDate"
              type="date"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Duration</label>
            <select
              name="duration"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white"
            >
              <option value="">Select duration</option>
              <option value="4-weeks">4 weeks</option>
              <option value="8-weeks">8 weeks</option>
              <option value="12-weeks">12 weeks</option>
              <option value="16-weeks">16 weeks</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2">Tell us about yourself</label>
          <textarea
            name="message"
            rows="5"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white"
            placeholder="Your skills, interests, and why you want the internship"
          ></textarea>
        </div>

        <button type="submit" disabled={submitting} className="w-full btn-primary justify-center">
          {submitting ? "Sending…" : "Send application"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";

interface InternshipFormData {
  fullName: string;
  email: string;
  phone: string;
  institutionType: string;
  programOffering: string;
  level: string;
  startDate: string;
  duration: string;
  message: string;
}

const EMPTY_FORM: InternshipFormData = {
  fullName: "",
  email: "",
  phone: "",
  institutionType: "",
  programOffering: "",
  level: "",
  startDate: "",
  duration: "",
  message: "",
};

export default function InternshipForm() {
  const [formData, setFormData] = useState<InternshipFormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/content/internship-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          recipient: "info@skytechghana.com",
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      try {
        await fetch("/api/sms/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: [
              "New internship application:",
              `Name: ${formData.fullName}`,
              `Phone: ${formData.phone}`,
              `Email: ${formData.email}`,
              `Program: ${formData.programOffering}`,
              `Institution: ${formData.institutionType}`,
              `Level: ${formData.level}`,
              `Duration: ${formData.duration}`,
            ].join("\n"),
            recipients: ["233552892433"],
          }),
        });
      } catch (err) {
        console.error("Failed to send Arkesel SMS:", err);
      }

      alert("Application submitted successfully!");
      setFormData(EMPTY_FORM);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:bg-white focus:ring-2 focus:ring-brand-200";

  return (
    <section className="bg-slate-50 px-6 py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="section-tag justify-center">Internship</span>
          <h1 className="section-title mt-4 text-3xl text-balance sm:text-4xl lg:text-5xl">
            Internship Form
          </h1>
          <p className="section-lead mt-3">Please fill in your details</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-12 space-y-5 rounded-3xl border border-slate-100 bg-white p-8 shadow-lift lg:p-10"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <input
              className={inputClass}
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <input
              className={inputClass}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              className={inputClass}
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              className={inputClass}
              type="text"
              name="institutionType"
              placeholder="Institution Type"
              value={formData.institutionType}
              onChange={handleChange}
              required
            />

            <input
              className={inputClass}
              type="text"
              name="programOffering"
              placeholder="Program Offering"
              value={formData.programOffering}
              onChange={handleChange}
              required
            />

            <input
              className={inputClass}
              type="text"
              name="level"
              placeholder="Level"
              value={formData.level}
              onChange={handleChange}
              required
            />

            <input
              className={inputClass}
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />

            <input
              className={inputClass}
              type="text"
              name="duration"
              placeholder="Duration"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            className={`${inputClass} min-h-[11.25rem] resize-none`}
            name="message"
            placeholder="Your Skills Interests, and why you want the internship"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 py-4 text-lg font-medium text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Apply Now"}
          </button>

          <p className="text-center text-sm text-slate-500">
            You&apos;ll receive an approval Email or SMS if your application is approved.
          </p>
        </form>
      </div>
    </section>
  );
}
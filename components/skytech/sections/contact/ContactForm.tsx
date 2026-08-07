"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

import FlagsList from "@/components/skytech/ui/FlagsList";

interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/content/contact-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          recipient: "info@skytechghana.com",
        }),
      });

      if (!response.ok) throw new Error("Submission failed");

      try {
        await fetch("/api/sms/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: [
              "New contact message:",
              `Name: ${formData.fullName}`,
              `Phone: ${formData.phone}`,
              `Email: ${formData.email}`,
              `Message: ${formData.message}`,
            ].join("\n"),
            recipients: ["233552892433"],
          }),
        });
      } catch (err) {
        console.error("Failed to send Arkesel SMS:", err);
      }

      alert("Message sent!");

      setFormData({
        fullName: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch {
      alert("Unable to send message.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-gray-300 px-4 py-4 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200";

  return (
    <section className="bg-white px-6 py-12 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <span className="pill">Contact</span>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900 md:text-5xl">
            We&apos;d love to hear from you.
          </h2>

          <p className="mt-3 max-w-xl text-slate-600">
            Whether you&apos;ve a project in mind, want to collaborate, or just have
            questions, feel free to reach out. Our team is ready to help.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              className={inputStyle}
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <input
              className={inputStyle}
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              className={inputStyle}
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <textarea
              className={`${inputStyle} min-h-[10.625rem] resize-none`}
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button
              disabled={loading}
              className="w-full rounded-xl bg-brand-600 py-4 text-lg font-medium text-white shadow-soft transition hover:bg-brand-700"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div>
            <div className="overflow-hidden rounded-xl shadow">
              <iframe
                title="SkyTech Ghana"
                src="https://maps.google.com/maps?q=5.6519898,-0.0643809&z=19&output=embed"
                loading="lazy"
                className="h-64 w-full border-0"
                allowFullScreen
              />
            </div>

            <div className="mt-8">
              <h3 className="text-3xl font-semibold leading-tight text-slate-900 md:text-5xl">
                SPEAK TO OUR
                <br />
                24/7 SUPPORT.
              </h3>

              <div className="mt-8 space-y-3 text-lg">
                <div className="h-6 w-6 inline-block">
                  <Image src="/images/icons/mailIcon.svg" alt="Mail Icon" width={24} height={24} className="inline-block w-full h-full" />
                </div>
                &nbsp;&nbsp;
                <p className="inline-block">info@skytechghana.com</p>

                <br />
                <div className="h-6 w-6 inline-block">
                  <Image src="/images/icons/telephoneIcon.svg" alt="Telephone Icon" width={24} height={24} className="inline-block w-full h-full" />
                </div>
                &nbsp;&nbsp;
                <p className="inline-block">+233 55 289 2433</p>
              </div>

              <div className="mt-8">
                <p className="mb-2 text-gray-600">All international enquiries</p>

                <div className="flex items-center gap-2 text-2xl">
                  <FlagsList />
                </div>

                <div className="mt-4 space-y-3 text-lg">
                  <div className="h-6 w-6 inline-block">
                    <Image src="/images/icons/mailIcon.svg" alt="Mail Icon" width={24} height={24} className="inline-block w-full h-full" />
                  </div>
                  &nbsp;&nbsp;
                  <p className="inline-block">world@skytechghana.com</p>

                  <br />
                  <div className="h-6 w-6 inline-block">
                    <Image src="/images/icons/telephoneIcon.svg" alt="Telephone Icon" width={24} height={24} className="inline-block w-full h-full" />
                  </div>
                  &nbsp;&nbsp;
                  <p className="inline-block">+1 558 289 2433</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

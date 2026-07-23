'use client'
import Image from "next/image";
import { FormEvent, useState } from "react";

import FlagsList from "@/components/ui/FlagsList";
import mailIcon from "@/assets/icons/mailIcon.svg";
import telephoneIcon from "@/assets/icons/telephoneIcon.svg";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Replace with the backend/email service
      await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          recipient: "info@skytechghana.com",
        }),
      });

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
    "w-full rounded-xl border border-gray-300 px-4 py-4 outline-none transition focus:border-[#355BC9] focus:ring-2 focus:ring-blue-200";

  return (
    <section className="bg-white py-12 px-6 md:py-20">
      <div className="mx-auto max-w-7xl">

        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-slate-900 md:text-5xl">
            We&apos;d love to hear from you.
          </h2>

          <p className="mt-3 max-w-xl text-gray-600">
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
              className={`${inputStyle} min-h-42.5 resize-none`}
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button
              disabled={loading}
              className="w-full rounded-xl bg-[#355BC9] py-4 text-lg font-medium text-white transition hover:bg-[#2b4bb4]"
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
                  <Image 
                  src={mailIcon}
                  alt="Mail Icon"
                  className="inline-block w-full h-full"
                />
              </div>
              &nbsp;&nbsp;
                <p className="inline-block">
                  info@skytechghana.com
                </p>
                
                  <br />
                <div className="h-6 w-6 inline-block">
                  <Image 
                    src={telephoneIcon}
                    alt="Telephone Icon"
                    className="inline-block w-full h-full"
                  />
                </div>
                &nbsp;&nbsp;
                <p className="inline-block">
                  +233 55 289 2433
                </p>

              </div>

              <div className="mt-8">

                <p className="mb-2 text-gray-600">
                  All international enquiries
                </p>

                <div className="flex items-center gap-2 text-2xl">
                  <FlagsList />
                </div>

                <div className="mt-4 space-y-3 text-lg">

                  <div className="h-6 w-6 inline-block">
                    <Image 
                      src={mailIcon}
                      alt="Mail Icon"
                      className="inline-block w-full h-full"
                    />
                  </div>
                  &nbsp;&nbsp;
                  <p className="inline-block">
                    world@skytechghana.com
                  </p>
                  
                  <br />
                  <div className="h-6 w-6 inline-block">
                    <Image 
                      src={telephoneIcon}
                      alt="Telephone Icon"
                      className="inline-block w-full h-full"
                    />
                  </div>
                  &nbsp;&nbsp;
                  <p className="inline-block">
                    +1 558 289 2433
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
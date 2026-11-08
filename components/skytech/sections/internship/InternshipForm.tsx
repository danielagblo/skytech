"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { ConversationalForm, type ConversationalStep } from "@/components/skytech/ui/ConversationalForm";

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

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGE_DIMENSION = 1024;
const IMAGE_QUALITY = 0.8;

async function compressImageFile(file: File): Promise<File> {
  let source: CanvasImageSource;
  let width: number;
  let height: number;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (bitmap) {
    source = bitmap;
    width = bitmap.width;
    height = bitmap.height;
  } else {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = document.createElement("img");
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("Could not read the selected image."));
        el.src = url;
      });
      source = img;
      width = img.naturalWidth;
      height = img.naturalHeight;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(width, height));
  const outW = Math.max(1, Math.round(width * scale));
  const outH = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    if (bitmap) bitmap.close();
    throw new Error("Could not compress the selected image.");
  }
  ctx.drawImage(source, 0, 0, outW, outH);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Could not compress the selected image."))),
      "image/jpeg",
      IMAGE_QUALITY,
    );
  });

  if (bitmap) bitmap.close();
  const baseName = (file.name || "photo").replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}

export default function InternshipForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<InternshipFormData>(EMPTY_FORM);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError("");

    if (!file) {
      setProfilePhoto(null);
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setPhotoError("Please upload a JPG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError("Photo must be 5MB or smaller.");
      e.target.value = "";
      return;
    }

    setProfilePhoto(file);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setStep(0);
    setFormData(EMPTY_FORM);
    setProfilePhoto(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    setPhotoError("");
  };

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();

    if (!profilePhoto) {
      setPhotoError("Please upload a profile picture.");
      return;
    }

    setLoading(true);

    try {
      let compressed: File;
      try {
        compressed = await compressImageFile(profilePhoto);
      } catch (err) {
        throw new Error(
          `Could not process the photo: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }

      const uploadData = new FormData();
      uploadData.append("file", compressed);
      uploadData.append("folder", "interns");

      let uploadRes: Response;
      try {
        uploadRes = await fetch("/api/content/upload-image", {
          method: "POST",
          body: uploadData,
        });
      } catch (err) {
        throw new Error(
          `Photo upload failed (network): ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }

      const uploadJson = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok || !uploadJson.url) {
        throw new Error(
          `Photo upload failed (HTTP ${uploadRes.status}): ${uploadJson.error || "Unknown error"}`,
        );
      }

      let response: Response;
      try {
        response = await fetch("/api/content/internship-submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            name: formData.fullName,
            school: formData.institutionType,
            program: formData.programOffering,
            image: uploadJson.url,
            recipient: "info@skytechghana.com",
          }),
        });
      } catch (err) {
        throw new Error(
          `Submission failed (network): ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(
          `Submission failed (HTTP ${response.status}): ${errJson.error || "Unknown error"}`,
        );
      }

      try {
        const smsRes = await fetch("/api/sms/send", {
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
            recipients: ["233538311626"],
          }),
        });
        if (!smsRes.ok) {
          const smsErr = await smsRes.json().catch(() => ({}));
          console.error("Failed to send Arkesel SMS:", smsRes.status, smsErr);
        }
      } catch (err) {
        console.error("Failed to send Arkesel SMS:", err);
      }

      alert("Application submitted successfully!");
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-none border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:bg-white focus:ring-2 focus:ring-brand-200 sm:py-4";
  const emailOk = /\S+@\S+\.\S+/.test(formData.email.trim());
  const phoneOk = formData.phone.replace(/[^\d]/g, "").length >= 7;
  const setField = (name: keyof InternshipFormData, value: string) => {
    setFormData((current) => ({ ...current, [name]: value }));
  };
  const steps: ConversationalStep[] = [
    {
      id: "photo",
      question: "Add a profile picture",
      hint: "A clear headshot. JPG, PNG, or WebP up to 5MB.",
      valid: Boolean(profilePhoto) && !photoError,
      body: (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100">
            {photoPreview ? (
              <Image src={photoPreview} alt="Profile preview" fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            )}
          </div>
          <div className="text-center sm:text-left">
            <label
              htmlFor="profilePhoto"
              className="cursor-pointer rounded-none border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-600 hover:bg-white"
            >
              {profilePhoto ? "Change photo" : "Upload photo"}
            </label>
            {profilePhoto && (
              <button
                type="button"
                onClick={() => {
                  setProfilePhoto(null);
                  if (photoPreview) URL.revokeObjectURL(photoPreview);
                  setPhotoPreview(null);
                  setPhotoError("");
                }}
                className="ml-3 text-sm font-medium text-red-600"
              >
                Remove
              </button>
            )}
            <input
              id="profilePhoto"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />
            {photoError && <p className="mt-2 text-sm text-red-600">{photoError}</p>}
          </div>
        </div>
      ),
    },
    {
      id: "name",
      question: "What is your full name?",
      valid: Boolean(formData.fullName.trim()),
      body: (
        <input
          className={inputClass}
          value={formData.fullName}
          onChange={(event) => setField("fullName", event.target.value)}
          placeholder="Full name"
        />
      ),
    },
    {
      id: "email",
      question: "What is your email?",
      valid: emailOk,
      body: (
        <div>
          <input
            className={inputClass}
            type="email"
            value={formData.email}
            onChange={(event) => setField("email", event.target.value)}
            placeholder="you@example.com"
          />
          {formData.email.trim() && !emailOk && (
            <p className="mt-2 text-sm text-red-600">Enter a valid email address.</p>
          )}
        </div>
      ),
    },
    {
      id: "phone",
      question: "What is your phone number?",
      valid: phoneOk,
      body: (
        <input
          className={inputClass}
          type="tel"
          value={formData.phone}
          onChange={(event) => setField("phone", event.target.value)}
          placeholder="Phone number"
        />
      ),
    },
    {
      id: "institution",
      question: "What kind of institution are you from?",
      valid: Boolean(formData.institutionType.trim()),
      body: (
        <input
          className={inputClass}
          value={formData.institutionType}
          onChange={(event) => setField("institutionType", event.target.value)}
          placeholder="University, training school..."
        />
      ),
    },
    {
      id: "program",
      question: "Which program are you offering?",
      valid: Boolean(formData.programOffering.trim()),
      body: (
        <input
          className={inputClass}
          value={formData.programOffering}
          onChange={(event) => setField("programOffering", event.target.value)}
          placeholder="Program"
        />
      ),
    },
    {
      id: "level",
      question: "What level are you in?",
      valid: Boolean(formData.level.trim()),
      body: (
        <input
          className={inputClass}
          value={formData.level}
          onChange={(event) => setField("level", event.target.value)}
          placeholder="Level"
        />
      ),
    },
    {
      id: "start",
      question: "When can you start?",
      valid: Boolean(formData.startDate),
      body: (
        <input
          className={inputClass}
          type="date"
          value={formData.startDate}
          onChange={(event) => setField("startDate", event.target.value)}
        />
      ),
    },
    {
      id: "duration",
      question: "How long is the internship?",
      valid: Boolean(formData.duration.trim()),
      body: (
        <input
          className={inputClass}
          value={formData.duration}
          onChange={(event) => setField("duration", event.target.value)}
          placeholder="For example, 3 months"
        />
      ),
    },
    {
      id: "message",
      question: "Why do you want this internship?",
      hint: "Share your skills, interests, and what you hope to learn.",
      valid: Boolean(formData.message.trim()),
      body: (
        <textarea
          className={`${inputClass} min-h-36 resize-none`}
          value={formData.message}
          onChange={(event) => setField("message", event.target.value)}
          placeholder="Your skills, interests, and why you want the internship"
        />
      ),
    },
  ];

  return (
    <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 md:px-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="section-tag justify-center">Internship</span>
          <h1 className="section-title mt-3 text-2xl text-balance sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl">
            Internship Form
          </h1>
          <p className="section-lead mt-2 text-sm sm:mt-3 sm:text-base">
            Answer one question at a time
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-xl rounded-none border border-slate-100 bg-white p-4 shadow-lift sm:mt-10 sm:p-6 md:p-8">
          <ConversationalForm
            steps={steps}
            index={step}
            onIndexChange={setStep}
            onSubmit={() => void handleSubmit()}
            submitting={loading}
            submitLabel="Apply now"
            accent="slate"
            footerNote="You'll receive an approval email or SMS if your application is approved."
          />
        </div>
      </div>
    </section>
  );
}
"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
    setFormData(EMPTY_FORM);
    setProfilePhoto(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    setPhotoError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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

  return (
    <section className="bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 md:px-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="section-tag justify-center">Internship</span>
          <h1 className="section-title mt-3 text-2xl text-balance sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl">
            Internship Form
          </h1>
          <p className="section-lead mt-2 text-sm sm:mt-3 sm:text-base">Please fill in your details</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-none border border-slate-100 bg-white p-4 shadow-lift sm:mt-10 sm:space-y-5 sm:p-6 md:p-8 lg:p-10"
        >
          <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:pb-8">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 sm:h-28 sm:w-28">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <label htmlFor="profilePhoto" className="block text-sm font-semibold text-slate-900">
                Profile Picture <span className="text-red-500">*</span>
              </label>
              <p className="mt-1 text-sm text-slate-500">
                Upload a clear headshot. JPG, PNG, or WebP up to 5MB.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <label
                  htmlFor="profilePhoto"
                  className="cursor-pointer rounded-none border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-600 hover:bg-white"
                >
                  {profilePhoto ? "Change Photo" : "Upload Photo"}
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
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                id="profilePhoto"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
              {photoError && (
                <p className="mt-2 text-sm text-red-600">{photoError}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
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

            <div>
              <label htmlFor="startDate" className="mb-2 block text-sm font-semibold text-slate-900">
                Start Date
              </label>
              <input
                id="startDate"
                className={inputClass}
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

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
            className={`${inputClass} min-h-[9rem] resize-none sm:min-h-[11.25rem]`}
            name="message"
            placeholder="Your Skills Interests, and why you want the internship"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-none bg-slate-950 py-3.5 text-base font-medium text-white shadow-soft transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70 sm:py-4 sm:text-lg"
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
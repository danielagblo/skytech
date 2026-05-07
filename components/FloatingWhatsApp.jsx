"use client";

function toWaDigits(value) {
  if (!value) return "";
  return String(value).replace(/[^\d]/g, "");
}

export default function FloatingWhatsApp({ whatsapp }) {
  const digits = toWaDigits(whatsapp);
  if (!digits) return null;

  const href = `https://wa.me/${digits}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Chat on WhatsApp"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-base">
        💬
      </span>
      <span className="hidden sm:inline">Need help? Chat now</span>
      <span className="sm:hidden">Chat</span>
    </a>
  );
}


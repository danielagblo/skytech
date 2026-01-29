"use client";
import { useState } from "react";

export default function PDFViewer({ src, label = "View Pricing" }) {
  const [open, setOpen] = useState(false);

  if (!src) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-primary bg-blue-700 hover:bg-blue-800"
      >
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="font-semibold">Pricing booklet</div>
              <div className="flex items-center gap-2">
                <a
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-slate-600 hover:underline"
                >
                  Open in new tab
                </a>
                <button
                  className="ml-3 px-3 py-1 bg-slate-100 rounded"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
            <iframe
              src={src}
              title="Pricing booklet"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  );
}

// PropTypes removed to avoid extra dependency in dev environment

"use client";

import React, { useState } from "react";
import { updateAffiliatesAction, uploadPartnerLogoAction } from "../../admin/actions";
import { IAffiliate } from "../../lib/affiliates";
import { getPartnerLogoHeight } from "../../lib/partnerLogo";

export default function AffiliateManager({ initialAffiliates }: { initialAffiliates: IAffiliate[] }) {
  const [affiliates, setAffiliates] = useState<IAffiliate[]>(
    initialAffiliates.map((a) => ({
      ...a,
      colSpan: a.colSpan ?? 1,
      rowSpan: a.rowSpan ?? 1,
      logoScale: a.logoScale ?? 100,
      visible: a.visible !== false,
    }))
  );
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [gridCols, setGridCols] = useState(6);

  const handleAdd = () => {
    setAffiliates([...affiliates, { name: "", logoUrl: "", colSpan: 1, rowSpan: 1, logoScale: 100, visible: true }]);
  };

  const handleDelete = (index: number) => {
    if (!confirm("Remove this partner?")) return;
    const updated = [...affiliates];
    updated.splice(index, 1);
    setAffiliates(updated);
  };

  const handleChange = (index: number, field: keyof IAffiliate, value: any) => {
    const updated = [...affiliates];
    (updated[index] as any)[field] = value;
    setAffiliates(updated);
  };

  const handleFileUpload = async (index: number, file: File) => {
    setUploading(`${index}`);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadPartnerLogoAction(formData);
    if (result.success && result.imageUrl) {
      handleChange(index, "logoUrl", result.imageUrl);
    } else {
      alert("Upload failed: " + result.error);
    }
    setUploading(null);
  };

  const movePartner = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= affiliates.length) return;
    const updated = [...affiliates];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setAffiliates(updated);
  };

  async function handleSave() {
    const hasEmptyNames = affiliates.some((a) => !a.name.trim());
    if (hasEmptyNames) {
      setMessage("Error: All partners must have a name before saving.");
      return;
    }
    setLoading(true);
    setMessage("");
    const result = await updateAffiliatesAction(affiliates);
    if (result.success) {
      setMessage("Partner Network synchronized successfully.");
    } else {
      setMessage("Error: " + result.error);
    }
    setLoading(false);
  }

  const visiblePartners = affiliates.filter((a) => a.visible !== false);

  return (
    <div className="space-y-10">
      {message && (
        <div className={`p-5 rounded-2xl text-sm font-bold border ${
          message.includes("Error")
            ? "bg-red-50 text-red-600 border-red-100"
            : "bg-green-50 text-green-600 border-green-100"
        }`}>
          {message}
        </div>
      )}

      {/* Grid Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Grid Preview</h2>
            <p className="text-xs text-slate-400 mt-1">This is how the logos appear on the site. Adjust columns below.</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Columns</label>
            {[3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => setGridCols(n)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                  gridCols === n
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gap: 0,
          }}
        >
          {visiblePartners.map((partner, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center border-[0.5px] border-slate-100 bg-white"
              style={{
                gridColumn: `span ${Math.min(partner.colSpan || 1, gridCols)}`,
                gridRow: `span ${partner.rowSpan || 1}`,
                padding: `${(partner.rowSpan || 1) * 28}px ${(partner.colSpan || 1) * 16}px`,
              }}
            >
              {partner.logoUrl ? (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                  style={{
                    height: `${getPartnerLogoHeight(partner)}px`,
                  }}
                />
              ) : (
                <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                  {partner.name || "No Logo"}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Partner Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
            All Partners ({affiliates.length})
          </h2>
          <button
            onClick={handleAdd}
            className="px-6 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
          >
            + Add Partner
          </button>
        </div>

        <div className="space-y-4">
          {affiliates.map((partner, pIdx) => (
            <div
              key={pIdx}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${
                partner.visible === false
                  ? "border-slate-100 opacity-50"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-start gap-5">
                {/* Logo preview */}
                <div
                  className="relative w-24 h-20 flex-shrink-0 rounded-xl bg-slate-50 border border-dashed border-slate-200 overflow-hidden flex items-center justify-center cursor-pointer group/logo"
                  onClick={() => document.getElementById(`upload-${pIdx}`)?.click()}
                >
                  {partner.logoUrl ? (
                    <img src={partner.logoUrl} alt={partner.name} className="max-w-[80%] max-h-[80%] object-contain" />
                  ) : (
                    <span className="text-slate-300 text-[8px] font-bold uppercase">Upload</span>
                  )}
                  <div className="absolute inset-0 bg-blue-600/80 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-[8px] font-black uppercase tracking-widest">
                      {uploading === `${pIdx}` ? "..." : "Change"}
                    </span>
                  </div>
                  <input
                    type="file"
                    id={`upload-${pIdx}`}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(pIdx, file);
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      className="flex-1 bg-transparent border-b border-slate-100 focus:border-blue-600 outline-none font-bold text-slate-900 pb-1 text-sm"
                      value={partner.name}
                      placeholder="Partner name"
                      onChange={(e) => handleChange(pIdx, "name", e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Logo Size */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                        Logo Size
                      </label>
                      <input
                        type="range"
                        min={50}
                        max={200}
                        step={5}
                        value={partner.logoScale ?? 100}
                        onChange={(e) => handleChange(pIdx, "logoScale", Number(e.target.value))}
                        className="flex-1 h-1.5 accent-blue-600 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-600 w-10 text-right tabular-nums">
                        {partner.logoScale ?? 100}%
                      </span>
                    </div>

                    {/* Column Span */}
                    <div className="flex items-center gap-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Col Span</label>
                      <div className="flex">
                        {[1, 2, 3].map((n) => (
                          <button
                            key={n}
                            onClick={() => handleChange(pIdx, "colSpan", n)}
                            className={`w-7 h-7 text-xs font-bold first:rounded-l-lg last:rounded-r-lg border transition-all ${
                              (partner.colSpan || 1) === n
                                ? "bg-blue-600 text-white border-blue-600 z-10"
                                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 -ml-px"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Row Span */}
                    <div className="flex items-center gap-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Row Span</label>
                      <div className="flex">
                        {[1, 2].map((n) => (
                          <button
                            key={n}
                            onClick={() => handleChange(pIdx, "rowSpan", n)}
                            className={`w-7 h-7 text-xs font-bold first:rounded-l-lg last:rounded-r-lg border transition-all ${
                              (partner.rowSpan || 1) === n
                                ? "bg-blue-600 text-white border-blue-600 z-10"
                                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 -ml-px"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Visibility */}
                    <button
                      onClick={() => handleChange(pIdx, "visible", !partner.visible)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                        partner.visible !== false
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${partner.visible !== false ? "bg-green-500" : "bg-slate-300"}`} />
                      {partner.visible !== false ? "Visible" : "Hidden"}
                    </button>

                    {/* Reorder */}
                    <div className="flex gap-1 ml-auto">
                      <button
                        onClick={() => movePartner(pIdx, -1)}
                        disabled={pIdx === 0}
                        className="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition text-xs"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => movePartner(pIdx, 1)}
                        disabled={pIdx === affiliates.length - 1}
                        className="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition text-xs"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => handleDelete(pIdx)}
                        className="w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-600 hover:text-white transition text-xs"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="fixed bottom-10 right-10 z-50">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-12 py-5 rounded-full font-black text-sm tracking-widest uppercase shadow-2xl transition-all ${
            loading
              ? "bg-slate-200 text-slate-400"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
          }`}
        >
          {loading ? "Synchronizing Network..." : "Save Affiliate Network"}
        </button>
      </div>
    </div>
  );
}

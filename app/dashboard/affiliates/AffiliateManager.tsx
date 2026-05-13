"use client";

import React, { useState } from "react";
import { updateAffiliatesAction, uploadPartnerLogoAction } from "../../admin/actions";
import { IAffiliate } from "../../lib/affiliates";

export default function AffiliateManager({ initialAffiliates }: { initialAffiliates: IAffiliate[] }) {
  const [affiliates, setAffiliates] = useState<IAffiliate[]>(initialAffiliates);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleAdd = () => {
    setAffiliates([...affiliates, { name: "", logoUrl: "" }]);
  };

  const handleDelete = (index: number) => {
    const newAffiliates = [...affiliates];
    newAffiliates.splice(index, 1);
    setAffiliates(newAffiliates);
  };

  const handleInputChange = (index: number, field: keyof IAffiliate, value: string) => {
    const newAffiliates = [...affiliates];
    (newAffiliates[index] as any)[field] = value;
    setAffiliates(newAffiliates);
  };

  const handleFileUpload = async (index: number, file: File) => {
    setUploading(`${index}`);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadPartnerLogoAction(formData);
    if (result.success && result.imageUrl) {
      handleInputChange(index, "logoUrl", result.imageUrl);
    } else {
      alert("Upload failed: " + result.error);
    }
    setUploading(null);
  };

  async function handleSave() {
    // Basic validation
    const hasEmptyNames = affiliates.some(a => !a.name.trim());
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

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
            Partner Network
          </h2>
          <button
            onClick={handleAdd}
            className="px-6 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
          >
            + Add Partner
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {affiliates.map((partner, pIdx) => (
            <div key={pIdx} className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm space-y-4 group">
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Partner Name</label>
                  <input 
                    className="w-full bg-transparent border-b border-slate-100 focus:border-blue-600 outline-none font-bold text-slate-900 pb-2"
                    value={partner.name}
                    onChange={(e) => handleInputChange(pIdx, "name", e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => handleDelete(pIdx)}
                  className="p-2 text-slate-300 hover:text-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Brand Logo</label>
                <div 
                  className="relative aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-slate-100 overflow-hidden flex items-center justify-center group/logo cursor-pointer"
                  onClick={() => document.getElementById(`upload-${pIdx}`)?.click()}
                >
                  {partner.logoUrl ? (
                    <img src={partner.logoUrl} alt={partner.name} className="max-w-[80%] max-h-[80%] object-contain" />
                  ) : (
                    <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">No Logo Set</span>
                  )}
                  
                  <div className="absolute inset-0 bg-blue-600/80 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">
                      {uploading === `${pIdx}` ? "Uploading..." : "Change Logo"}
                    </span>
                  </div>
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
            </div>
          ))}
        </div>
      </div>

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

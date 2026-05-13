"use client";

import React, { useState } from "react";
import { updateHomeHero } from "../../admin/actions";

export default function HeroForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentHero, setCurrentHero] = useState(initialData);

  async function handleSubmit(e: any) {
    if (e.preventDefault) e.preventDefault();
    setLoading(true);
    setMessage("");

    const target = e.target.form || e.target;
    const formData = new FormData(target);
    const result = await updateHomeHero(formData);

    if (result.success) {
      setMessage("Home Hero updated successfully.");
      if (result.imageUrl) {
        setCurrentHero((prev: any) => ({ ...prev, imageUrl: result.imageUrl }));
      }
    } else {
      setMessage("Error updating Hero: " + result.error);
    }
    setLoading(false);
  }

  const triggerUpload = () => {
    document.getElementById("hero-upload")?.click();
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm text-center space-y-8">
      {message && (
        <div
          className={`p-5 rounded-2xl text-sm font-bold ${
            message.includes("Error")
              ? "bg-red-50 text-red-600 border border-red-100"
              : "bg-green-50 text-green-600 border border-green-100"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Main Title</label>
            <textarea 
              name="title"
              value={currentHero.title}
              onChange={(e) => setCurrentHero({...currentHero, title: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-900 min-h-[100px]"
              placeholder="Enter hero title..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Subtitle</label>
            <textarea 
              name="subtitle"
              value={currentHero.subtitle}
              onChange={(e) => setCurrentHero({...currentHero, subtitle: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-600 min-h-[100px]"
              placeholder="Enter hero subtitle..."
            />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Background Image</label>
          <input 
            type="file" 
            id="hero-upload"
            name="image" 
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // We don't submit immediately anymore, let the user click save
                const reader = new FileReader();
                reader.onload = (re) => setCurrentHero({...currentHero, imageUrl: re.target?.result as string});
                reader.readAsDataURL(file);
              }
            }}
          />
          <input type="hidden" name="currentImageUrl" value={currentHero.imageUrl} />
          
          <div 
            onClick={triggerUpload}
            className="relative aspect-video rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl cursor-pointer group hover:scale-[1.01] transition-all duration-500 bg-slate-100"
          >
            {currentHero.imageUrl ? (
              <img src={currentHero.imageUrl} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-black uppercase tracking-widest">
                No Image Set
              </div>
            )}
            
            <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-300">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-black uppercase tracking-tighter text-xl">
                Change Image
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-12 py-5 rounded-full font-black text-sm tracking-widest uppercase shadow-2xl transition-all ${
              loading 
                ? "bg-slate-200 text-slate-400" 
                : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
            }`}
          >
            {loading ? "Updating Hero..." : "Save Hero Content"}
          </button>
        </div>
      </form>

      
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
        Click the image to update the hero background
      </p>
    </div>
  );
}

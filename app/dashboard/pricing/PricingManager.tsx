"use client";

import React, { useState } from "react";
import { updatePricingCategory } from "../../admin/actions";

const EMPTY_PACKAGE = {
  name: "",
  tier: "",
  price: "",
  usd: "",
  renewal: "",
  interval: "",
  featured: false,
  highlights: [""],
};

export default function PricingManager({ initialPricing }: { initialPricing: any[] }) {
  const [activeCategory, setActiveCategory] = useState(initialPricing[0]?.category || "web");
  const [pricing, setPricing] = useState(initialPricing);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCatId, setNewCatId] = useState("");
  const [newCatLabel, setNewCatLabel] = useState("");

  const currentCategoryData = pricing.find((cat) => cat.category === activeCategory);

  const handleInputChange = (packageIdx: number, field: string, value: any) => {
    const newPricing = [...pricing];
    const catIdx = newPricing.findIndex((cat) => cat.category === activeCategory);
    newPricing[catIdx].packages[packageIdx][field] = value;
    setPricing(newPricing);
  };

  const handleHighlightChange = (packageIdx: number, highlightIdx: number, value: string) => {
    const newPricing = [...pricing];
    const catIdx = newPricing.findIndex((cat) => cat.category === activeCategory);
    newPricing[catIdx].packages[packageIdx].highlights[highlightIdx] = value;
    setPricing(newPricing);
  };

  const handleAddHighlight = (packageIdx: number) => {
    const newPricing = [...pricing];
    const catIdx = newPricing.findIndex((cat) => cat.category === activeCategory);
    newPricing[catIdx].packages[packageIdx].highlights.push("");
    setPricing(newPricing);
  };

  const handleRemoveHighlight = (packageIdx: number, highlightIdx: number) => {
    const newPricing = [...pricing];
    const catIdx = newPricing.findIndex((cat) => cat.category === activeCategory);
    newPricing[catIdx].packages[packageIdx].highlights.splice(highlightIdx, 1);
    setPricing(newPricing);
  };

  const handleDeletePackage = (packageIdx: number) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    const newPricing = [...pricing];
    const catIdx = newPricing.findIndex((cat) => cat.category === activeCategory);
    newPricing[catIdx].packages.splice(packageIdx, 1);
    setPricing(newPricing);
  };

  const handleAddPackage = () => {
    const newPricing = [...pricing];
    const catIdx = newPricing.findIndex((cat) => cat.category === activeCategory);
    newPricing[catIdx].packages.push({ ...EMPTY_PACKAGE, highlights: [""] });
    setPricing(newPricing);
  };

  const handleAddCategory = () => {
    const id = newCatId.trim().toLowerCase().replace(/\s+/g, "-");
    const label = newCatLabel.trim();
    if (!id || !label) return;
    if (pricing.some((c) => c.category === id)) {
      setMessage("Error: A category with that ID already exists.");
      return;
    }
    setPricing([...pricing, { category: id, label, packages: [] }]);
    setActiveCategory(id);
    setShowNewCategory(false);
    setNewCatId("");
    setNewCatLabel("");
    setMessage("");
  };

  async function handleSave() {
    if (!currentCategoryData) return;
    setLoading(true);
    setMessage("");
    const result = await updatePricingCategory(activeCategory, currentCategoryData.packages);
    if (result.success) {
      setMessage(`Successfully synchronized ${currentCategoryData.label} pricing.`);
    } else {
      setMessage("Error: " + result.error);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-10">
      {/* Category Tabs */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex overflow-x-auto no-scrollbar gap-3 p-2 bg-slate-100 rounded-3xl w-fit">
          {pricing.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat.category
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowNewCategory(true)}
          className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
        >
          + New Category
        </button>
      </div>

      {/* New Category Form */}
      {showNewCategory && (
        <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category ID</label>
            <input
              className="w-48 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium"
              placeholder="e.g. web, mobile, seo"
              value={newCatId}
              onChange={(e) => setNewCatId(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Display Label</label>
            <input
              className="w-64 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium"
              placeholder="e.g. Web Development"
              value={newCatLabel}
              onChange={(e) => setNewCatLabel(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddCategory}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition"
          >
            Create
          </button>
          <button
            onClick={() => { setShowNewCategory(false); setNewCatId(""); setNewCatLabel(""); }}
            className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-500 text-sm font-bold hover:bg-slate-200 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {message && (
        <div className={`p-5 rounded-2xl text-sm font-bold border ${
          message.includes("Error") 
            ? "bg-red-50 text-red-600 border-red-100" 
            : "bg-green-50 text-green-600 border-green-100"
        }`}>
          {message}
        </div>
      )}

      {/* Pricing Grid Management */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {currentCategoryData?.packages.map((pkg: any, pIdx: number) => (
          <div key={pIdx} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm space-y-8">
            <div className="flex justify-between items-start border-b border-slate-50 pb-6">
              <div className="space-y-1">
                <input 
                  className="text-xl font-black text-slate-900 bg-transparent border-none focus:ring-0 w-full"
                  value={pkg.name}
                  placeholder="Package name"
                  onChange={(e) => handleInputChange(pIdx, 'name', e.target.value)}
                />
                <input 
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-transparent border-none focus:ring-0"
                  value={pkg.tier}
                  placeholder="Tier label"
                  onChange={(e) => handleInputChange(pIdx, 'tier', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Featured</span>
                  <input 
                    type="checkbox"
                    checked={pkg.featured}
                    onChange={(e) => handleInputChange(pIdx, 'featured', e.target.checked)}
                    className="rounded-full text-blue-600 focus:ring-blue-600"
                  />
                </div>
                <button 
                  onClick={() => handleDeletePackage(pIdx)}
                  className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                  title="Delete Package"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price (GHS)</label>
                <input 
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold"
                  value={pkg.price}
                  placeholder="e.g. 2,500"
                  onChange={(e) => handleInputChange(pIdx, 'price', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price (USD)</label>
                <input 
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold"
                  value={pkg.usd}
                  placeholder="e.g. 175"
                  onChange={(e) => handleInputChange(pIdx, 'usd', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Renewal (GHS)</label>
                <input 
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold"
                  value={pkg.renewal}
                  placeholder="e.g. 1,000"
                  onChange={(e) => handleInputChange(pIdx, 'renewal', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interval</label>
                <input 
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold"
                  value={pkg.interval || ""}
                  placeholder="e.g. mo, yearly"
                  onChange={(e) => handleInputChange(pIdx, 'interval', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Technical Deliverables</label>
                <button
                  onClick={() => handleAddHighlight(pIdx)}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition"
                >
                  + Add item
                </button>
              </div>
              <div className="space-y-2">
                {pkg.highlights.map((h: string, hIdx: number) => (
                  <div key={hIdx} className="flex items-center gap-3">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                    <input 
                      className="w-full text-sm font-medium text-slate-600 bg-transparent border-none focus:ring-0 p-0"
                      value={h}
                      placeholder="Deliverable item"
                      onChange={(e) => handleHighlightChange(pIdx, hIdx, e.target.value)}
                    />
                    <button
                      onClick={() => handleRemoveHighlight(pIdx, hIdx)}
                      className="text-slate-300 hover:text-red-500 transition flex-shrink-0"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Add New Package card */}
        <button
          onClick={handleAddPackage}
          className="flex flex-col items-center justify-center gap-3 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all min-h-[260px]"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm font-black uppercase tracking-widest">Add New Package</span>
        </button>
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
          {loading ? "Synchronizing Rates..." : `Update ${currentCategoryData?.label} Packages`}
        </button>
      </div>
    </div>
  );
}

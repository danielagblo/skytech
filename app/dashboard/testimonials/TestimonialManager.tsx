'use client';

import { useState } from 'react';
import { ITestimonial } from '../../lib/testimonials';
import { updateTestimonialsAction } from '../../admin/actions';

export default function TestimonialManager({ initialTestimonials }: { initialTestimonials: ITestimonial[] }) {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>(initialTestimonials);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('All');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    author: '',
    company: '',
    quote: '',
    rating: 5,
  });

  const handleSaveAll = async (newTestimonials: ITestimonial[]) => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const result = await updateTestimonialsAction(newTestimonials);
      if (result.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Failed to save testimonials:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = () => {
    if (formData.author && formData.quote) {
      const newTestimonial: ITestimonial = {
        _id: Date.now().toString(),
        ...formData,
      };
      const next = [...testimonials, newTestimonial];
      setTestimonials(next);
      handleSaveAll(next);
      setFormData({ author: '', company: '', quote: '', rating: 5 });
      setIsAdding(false);
    }
  };

  const handleEdit = (testimonial: ITestimonial) => {
    setEditingId(testimonial._id || null);
    setFormData({
      author: testimonial.author,
      company: testimonial.company,
      quote: testimonial.quote,
      rating: testimonial.rating || 5,
    });
    setIsAdding(true);
  };

  const handleUpdate = () => {
    if (editingId) {
      const next = testimonials.map(t =>
        (t._id === editingId) ? { ...t, ...formData } : t
      );
      setTestimonials(next);
      handleSaveAll(next);
      setEditingId(null);
      setFormData({ author: '', company: '', quote: '', rating: 5 });
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string | undefined) => {
    if (!id || !confirm('Are you sure you want to delete this testimonial?')) return;
    const next = testimonials.filter(t => t._id !== id);
    setTestimonials(next);
    handleSaveAll(next);
  };

  const filteredTestimonials = testimonials.filter(t => {
    const matchesSearch = 
      t.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.quote.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === 'All' || t.rating === parseInt(filterRating);

    return matchesSearch && matchesRating;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Testimonials</h1>
          <p className="text-slate-600 mt-2">Manage client feedback and social proof</p>
        </div>
        <div className="flex items-center gap-4">
          {saveStatus === 'success' && <span className="text-green-600 text-sm font-bold animate-fade-in">✓ Changes Saved</span>}
          {saveStatus === 'error' && <span className="text-red-600 text-sm font-bold">❌ Save Failed</span>}
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl ${
              isAdding 
                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-105 active:scale-95'
            }`}
          >
            {isAdding ? 'Cancel' : '+ Add Testimonial'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        {isAdding && (
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                {editingId ? 'Edit Testimonial' : 'New Testimonial'}
              </h3>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Author Name</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Company / Role</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. CEO, Tech Corp"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Quote</label>
                  <textarea
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[120px]"
                    placeholder="What did the client say?"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={editingId ? handleUpdate : handleAdd}
                    disabled={isSaving}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-600/20"
                  >
                    {isSaving ? 'Saving...' : editingId ? 'Update' : 'Add'}
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setEditingId(null);
                      setFormData({ author: '', company: '', quote: '', rating: 5 });
                    }}
                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* List Column */}
        <div className={`${isAdding ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6`}>
          {/* Search/Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search author, company, quote..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </div>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full md:w-48 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm appearance-none font-semibold text-slate-600"
            >
              <option value="All">All Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTestimonials.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No testimonials found</p>
              </div>
            ) : (
              filteredTestimonials.map((t) => (
                <div key={t._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black text-sm">
                        {t.author.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">{t.author}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.company}</p>
                      </div>
                    </div>
                    <div className="text-xs">
                      {Array(t.rating).fill('⭐').join('')}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic line-clamp-4 mb-6">
                    "{t.quote}"
                  </p>
                  <div className="flex gap-2 pt-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(t)}
                      className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

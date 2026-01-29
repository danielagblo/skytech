'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  author: string;
  company: string;
  quote: string;
  rating: number;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    author: '',
    company: '',
    quote: '',
    rating: 5,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/content/testimonials');
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTestimonials = async (newTestimonials: Testimonial[]) => {
    try {
      await fetch('/api/content/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonials),
      });
    } catch (error) {
      console.error('Failed to save testimonials:', error);
    }
  };

  const handleAdd = () => {
    if (formData.author && formData.quote) {
      const newTestimonial: Testimonial = {
        id: Date.now().toString(),
        ...formData,
      };
      const newTestimonials = [...testimonials, newTestimonial];
      setTestimonials(newTestimonials);
      saveTestimonials(newTestimonials);
      setFormData({ author: '', company: '', quote: '', rating: 5 });
      setIsAdding(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      author: testimonial.author,
      company: testimonial.company,
      quote: testimonial.quote,
      rating: testimonial.rating,
    });
  };

  const handleSave = () => {
    if (editingId) {
      const newTestimonials = testimonials.map(t =>
        t.id === editingId ? { ...t, ...formData } : t
      );
      setTestimonials(newTestimonials);
      saveTestimonials(newTestimonials);
      setEditingId(null);
      setFormData({ author: '', company: '', quote: '', rating: 5 });
    }
  };

  const handleDelete = (id: string) => {
    const newTestimonials = testimonials.filter(t => t.id !== id);
    setTestimonials(newTestimonials);
    saveTestimonials(newTestimonials);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Testimonials Management</h1>
          <p className="text-slate-600 mt-2">Add and manage client testimonials</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          {isAdding ? 'Cancel' : '+ Add Testimonial'}
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Author Name</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  placeholder="Client name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  placeholder="Company name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Testimonial Quote</label>
              <textarea
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                placeholder="What did the client say?"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                <option value={3}>⭐⭐⭐ (3 stars)</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={editingId ? handleSave : handleAdd}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                {editingId ? 'Save Changes' : 'Add Testimonial'}
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ author: '', company: '', quote: '', rating: 5 });
                }}
                className="flex-1 px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-slate-900">{testimonial.author}</h3>
                <p className="text-sm text-slate-600">{testimonial.company}</p>
              </div>
              <div className="text-sm">
                {Array(testimonial.rating)
                  .fill('⭐')
                  .join('')}
              </div>
            </div>
            <p className="text-slate-700 italic mb-4">"{testimonial.quote}"</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(testimonial)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(testimonial.id)}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}

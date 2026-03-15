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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('All');
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
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    const newTestimonials = testimonials.filter(t => t.id !== id);
    setTestimonials(newTestimonials);
    saveTestimonials(newTestimonials);
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
          <h1 className="text-3xl font-bold text-slate-900">Testimonials Management</h1>
          <p className="text-slate-600 mt-2">Add and manage client testimonials</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm transition-colors"
        >
          {isAdding ? 'Cancel' : '+ Add Testimonial'}
        </button>
      </div>

      {/* Filters Overlay */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 md:space-y-0 md:flex md:gap-4 md:items-center">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search author, company, quote..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full md:w-48">
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Rating</label>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="All">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
            <option value="4">⭐⭐⭐⭐ (4)</option>
            <option value="3">⭐⭐⭐ (3)</option>
            <option value="2">⭐⭐ (2)</option>
            <option value="1">⭐ (1)</option>
          </select>
        </div>
        { (searchTerm || filterRating !== 'All') && (
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterRating('All');
            }}
            className="text-sm text-blue-600 font-semibold hover:text-blue-700 whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
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
          {filteredTestimonials.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center">
              <p className="text-slate-600">No testimonials found matching your filters</p>
            </div>
          ) : (
            filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
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
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

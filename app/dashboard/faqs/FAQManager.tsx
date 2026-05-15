'use client';

import { useState } from 'react';
import { IFAQ } from '../../lib/faqs';
import { updateFAQsAction } from '../../admin/actions';

export default function FAQManager({ initialFAQs }: { initialFAQs: IFAQ[] }) {
  const [faqs, setFaqs] = useState<IFAQ[]>(initialFAQs);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General Questions',
    order: 0,
    published: true
  });

  async function handleSave(newFaqs: IFAQ[]) {
    setLoading(true);
    setMessage('');
    const result = await updateFAQsAction(newFaqs);
    if (result.success && result.faqs) {
      setFaqs(result.faqs);
      setMessage('FAQs updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Error: ' + result.error);
    }
    setLoading(false);
  }

  const handleAdd = () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      setMessage('Error: Question and Answer are required.');
      return;
    }
    const newFaqs = [...faqs, { ...formData, _id: Date.now().toString() }];
    setFaqs(newFaqs);
    handleSave(newFaqs);
    setFormData({ question: '', answer: '', category: 'General Questions', order: faqs.length + 1, published: true });
    setIsAdding(false);
  };

  const handleUpdate = () => {
    if (!editingId) return;
    if (!formData.question.trim() || !formData.answer.trim()) {
      setMessage('Error: Question and Answer are required.');
      return;
    }
    const newFaqs = faqs.map(f => f._id === editingId ? { ...f, ...formData } : f);
    setFaqs(newFaqs);
    handleSave(newFaqs);
    setEditingId(null);
    setFormData({ question: '', answer: '', category: 'General Questions', order: 0, published: true });
    setIsAdding(false);
  };

  const handleDelete = (id: string | undefined) => {
    if (!id || !confirm('Delete this FAQ?')) return;
    const newFaqs = faqs.filter(f => f._id !== id);
    setFaqs(newFaqs);
    handleSave(newFaqs);
  };

  const togglePublished = (id: string | undefined) => {
    if (!id) return;
    const newFaqs = faqs.map(f => f._id === id ? { ...f, published: !f.published } : f);
    setFaqs(newFaqs);
    handleSave(newFaqs);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">FAQ Management</h1>
          <p className="text-slate-500">Manage frequently asked questions displayed on the site.</p>
        </div>
        <button
          onClick={() => {
            if (isAdding) {
              setEditingId(null);
              setFormData({ question: '', answer: '', category: 'General Questions', order: faqs.length, published: true });
            }
            setIsAdding(!isAdding);
          }}
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all"
        >
          {isAdding ? 'Cancel' : '+ Add FAQ'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl font-bold text-center ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      {isAdding && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-6">
          <h3 className="text-xl font-bold">{editingId ? 'Edit FAQ' : 'New FAQ'}</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question</label>
              <input
                type="text"
                value={formData.question}
                onChange={e => setFormData({ ...formData, question: e.target.value })}
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="How long does a typical project take?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Answer</label>
              <textarea
                value={formData.answer}
                onChange={e => setFormData({ ...formData, answer: e.target.value })}
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
                placeholder="A Basic Website usually takes 3-8 weeks..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Support Team, General, Billing"
              />
            </div>
            <div className="flex items-center gap-6">
               <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={e => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="published" className="text-sm font-bold text-slate-700">Published</label>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={loading}
              className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : editingId ? 'Update FAQ' : 'Save FAQ'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {faqs.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-slate-400">
            No FAQs found. Add your first one above.
          </div>
        ) : (
          faqs.sort((a, b) => a.order - b.order).map((faq) => (
            <div key={faq._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex items-start justify-between gap-6">
              <div className="flex-grow space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">{faq.order}</span>
                  <h3 className="font-bold text-slate-900">{faq.question}</h3>
                  {!faq.published && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-full">Draft</span>}
                </div>
                <p className="text-slate-500 text-sm pl-11">{faq.answer}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(faq._id!);
                    setFormData({ question: faq.question, answer: faq.answer, category: faq.category || 'General Questions', order: faq.order, published: faq.published });
                    setIsAdding(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  ✎
                </button>
                <button
                  onClick={() => togglePublished(faq._id)}
                  className={`p-2 rounded-lg transition-colors ${faq.published ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                  title={faq.published ? "Unpublish" : "Publish"}
                >
                  {faq.published ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => handleDelete(faq._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

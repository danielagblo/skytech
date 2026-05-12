'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveBlogPost, uploadBlogImage } from '../../../admin/blog-actions';
import LexicalEditor from '../../../../components/LexicalEditor';

export default function BlogForm({ post }: { post?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: post?._id || '',
    title: post?.title || '',
    slug: post?.slug || '',
    category: post?.category || 'Technology',
    excerpt: post?.excerpt || '',
    coverImage: post?.coverImage || '',
    published: post?.published || false,
    content: post?.content || '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await saveBlogPost(formData);
    if (result.success) {
      router.push('/dashboard/blog');
    } else {
      alert('Failed to save: ' + result.error);
    }
    setLoading(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData({ ...formData, title, slug: generatedSlug });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const data = new FormData();
    data.append('file', file);

    const result = await uploadBlogImage(data);
    if (result.success && result.imageUrl) {
      setFormData({ ...formData, coverImage: result.imageUrl });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSave} className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {post?._id ? 'Edit Post' : 'New Article'}
          </h1>
          <p className="text-slate-500 mt-1">Refine your thoughts and share with the world.</p>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Content Card */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Post Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full text-2xl font-bold border-none focus:ring-0 p-0 placeholder:text-slate-200"
                placeholder="Enter a captivating title..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Content</label>
              <LexicalEditor 
                key={formData._id || 'new'}
                value={formData.content} 
                onChange={(json) => setFormData({ ...formData, content: json })} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Sidebar Settings Card */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Cover Image</label>
              {formData.coverImage ? (
                <div className="aspect-video w-full rounded-2xl overflow-hidden relative group">
                  <img src={formData.coverImage} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setFormData({...formData, coverImage: ''})}
                    className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition-opacity"
                  >
                    Replace Image
                  </button>
                </div>
              ) : (
                <label className="aspect-video w-full border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Cover</span>
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold p-3 focus:ring-2 focus:ring-blue-100"
                >
                  <option>Technology</option>
                  <option>Design</option>
                  <option>SEO</option>
                  <option>Business</option>
                  <option>Development</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="custom-url-slug"
                  className="w-full bg-slate-50 border-none rounded-xl text-sm font-medium p-3 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-sm font-bold text-slate-700">Published</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, published: !formData.published })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.published ? 'bg-green-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.published ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full bg-slate-50 border-none rounded-2xl text-sm font-medium p-4 focus:ring-2 focus:ring-blue-100 min-h-[120px]"
              placeholder="Brief summary for social media and list views..."
            />
          </div>
        </div>
      </div>
    </form>
  );
}

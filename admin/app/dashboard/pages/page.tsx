'use client';

import { useState } from 'react';

interface PageItem {
  id: string;
  name: string;
  title: string;
  description: string;
  lastUpdated: string;
}

const initialPages: PageItem[] = [
  {
    id: '1',
    name: 'Home',
    title: 'Welcome to SkyTech',
    description: 'Hero section and featured content',
    lastUpdated: '2024-01-20',
  },
  {
    id: '2',
    name: 'About',
    title: 'About SkyTech',
    description: 'Company story and values',
    lastUpdated: '2024-01-18',
  },
  {
    id: '3',
    name: 'Services',
    title: 'Our Services',
    description: 'Service offerings and pricing',
    lastUpdated: '2024-01-19',
  },
  {
    id: '4',
    name: 'Contact',
    title: 'Get In Touch',
    description: 'Contact form and information',
    lastUpdated: '2024-01-15',
  },
];

export default function PagesPage() {
  const [pages, setPages] = useState<PageItem[]>(initialPages);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const handleEdit = (page: PageItem) => {
    setEditingId(page.id);
    setFormData({ title: page.title, description: page.description });
  };

  const handleSave = (id: string) => {
    setPages(pages.map(p =>
      p.id === id
        ? { ...p, title: formData.title, description: formData.description, lastUpdated: new Date().toISOString().split('T')[0] }
        : p
    ));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setPages(pages.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Pages Management</h1>
        <p className="text-slate-600 mt-2">Edit your website pages and content</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Page Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Last Updated</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{page.name}</td>
                <td className="px-6 py-4 text-slate-700">
                  {editingId === page.id ? (
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                  ) : (
                    page.title
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{page.lastUpdated}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  {editingId === page.id ? (
                    <>
                      <button
                        onClick={() => handleSave(page.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-slate-300 text-slate-900 rounded text-sm hover:bg-slate-400"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(page)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Edit Page Description</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm"
                rows={4}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

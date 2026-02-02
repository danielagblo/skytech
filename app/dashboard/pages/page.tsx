'use client';

import { useState, useEffect } from 'react';

interface PageContent {
  [key: string]: string;
}

interface PagesData {
  [key: string]: PageContent;
}

const pageList = [
  {
    id: 'home',
    name: 'Home',
    icon: '🏠',
    sections: [
      { key: 'heroTitle', label: 'Hero Title', type: 'textarea' },
      { key: 'heroSubtitle', label: 'Hero Subtitle', type: 'textarea' },
      { key: 'featuresSectionTitle', label: 'Features Section Title', type: 'text' },
      { key: 'featuresSectionSubtitle', label: 'Features Section Subtitle', type: 'text' },
      { key: 'servicesSectionTitle', label: 'Services Section Title', type: 'text' },
      { key: 'servicesSubtitle', label: 'Services Subtitle', type: 'text' },
      { key: 'ctaTitle', label: 'CTA Title', type: 'text' },
      { key: 'ctaSubtitle', label: 'CTA Subtitle', type: 'textarea' },
    ],
  },
  {
    id: 'services',
    name: 'Services',
    icon: '⚙️',
    sections: [
      { key: 'heroTitle', label: 'Hero Title', type: 'text' },
      { key: 'heroSubtitle', label: 'Hero Subtitle', type: 'textarea' },
      { key: 'whatWeDoTitle', label: 'Section Title', type: 'text' },
      { key: 'whatWeDoSubtitle', label: 'Section Subtitle', type: 'text' },
      { key: 'engagementTitle', label: 'Engagement Title', type: 'text' },
      { key: 'engagementSubtitle', label: 'Engagement Subtitle', type: 'text' },
      { key: 'ctaTitle', label: 'CTA Title', type: 'text' },
      { key: 'ctaSubtitle', label: 'CTA Subtitle', type: 'textarea' },
    ],
  },
  {
    id: 'contact',
    name: 'Contact',
    icon: '📧',
    sections: [
      { key: 'heroTitle', label: 'Hero Title', type: 'text' },
      { key: 'heroSubtitle', label: 'Hero Subtitle', type: 'textarea' },
      { key: 'contactInfoTitle', label: 'Contact Info Title', type: 'text' },
      { key: 'formTitle', label: 'Form Title', type: 'text' },
      { key: 'formSubtitle', label: 'Form Subtitle', type: 'text' },
      { key: 'teamTitle', label: 'Team Section Title', type: 'text' },
      { key: 'teamSubtitle', label: 'Team Section Subtitle', type: 'text' },
    ],
  },
  {
    id: 'about',
    name: 'About',
    icon: 'ℹ️',
    sections: [
      { key: 'heroTitle', label: 'Hero Title', type: 'textarea' },
      { key: 'heroSubtitle', label: 'Hero Subtitle', type: 'textarea' },
      { key: 'missionTitle', label: 'Mission Title', type: 'text' },
      { key: 'missionSubtitle', label: 'Mission Subtitle', type: 'text' },
      { key: 'valuesTitle', label: 'Values Title', type: 'text' },
      { key: 'valuesSubtitle', label: 'Values Subtitle', type: 'text' },
      { key: 'teamTitle', label: 'Team Title', type: 'text' },
      { key: 'teamSubtitle', label: 'Team Subtitle', type: 'textarea' },
    ],
  },
    {
      id: 'internship',
      name: 'Internship',
      icon: '🎓',
      sections: [
        { key: 'heroTitle', label: 'Hero Title', type: 'text' },
        { key: 'heroSubtitle', label: 'Hero Subtitle', type: 'textarea' },
        { key: 'whoCanApplyTitle', label: 'Who Can Apply Title', type: 'text' },
        { key: 'formTitle', label: 'Form Title', type: 'text' },
        { key: 'formSubtitle', label: 'Form Subtitle', type: 'text' },
        { key: 'responseTimeLabel', label: 'Response Time Label', type: 'text' },
        { key: 'responseTimeText', label: 'Response Time Text', type: 'text' },
      ],
    },
];

export default function PagesPage() {
  const [pagesData, setPagesData] = useState<PagesData>({});
  const [selectedPage, setSelectedPage] = useState('home');
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/content/pages');
      const data = await res.json();
      setPagesData(data);
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/content/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pagesData),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save pages:', error);
    }
  };

  const handleChange = (pageId: string, key: string, value: string) => {
    setPagesData({
      ...pagesData,
      [pageId]: {
        ...pagesData[pageId],
        [key]: value,
      },
    });
  };

  const currentPage = pageList.find(p => p.id === selectedPage);
  const currentContent = pagesData[selectedPage] || {};

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Pages Management</h1>
        <p className="text-slate-600 mt-2">Edit page content and text</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          ✓ Pages saved successfully
        </div>
      )}

      {/* Page Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {pageList.map((page) => (
          <button
            key={page.id}
            onClick={() => setSelectedPage(page.id)}
            className={`p-4 rounded-lg border-2 transition-all text-center ${
              selectedPage === page.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="text-2xl mb-2">{page.icon}</div>
            <p className="font-semibold text-slate-900">{page.name}</p>
          </button>
        ))}
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{currentPage?.name} Page</h2>
          <p className="text-slate-600 mt-1">Edit the text and content for this page</p>
        </div>

        <div className="space-y-6">
          {currentPage?.sections.map((section) => (
            <div key={section.key}>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                {section.label}
              </label>
              {section.type === 'textarea' ? (
                <textarea
                  value={currentContent[section.key] || ''}
                  onChange={(e) => handleChange(selectedPage, section.key, e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm font-mono"
                  rows={3}
                  placeholder={`Enter ${section.label.toLowerCase()}`}
                />
              ) : (
                <input
                  type="text"
                  value={currentContent[section.key] || ''}
                  onChange={(e) => handleChange(selectedPage, section.key, e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm"
                  placeholder={`Enter ${section.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Save Changes
          </button>
          <button
            onClick={fetchPages}
            className="px-6 py-3 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 font-semibold"
          >
            Discard
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-blue-900">
          <strong>Tip:</strong> Changes to page content will be reflected on the live website immediately after saving.
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  address: string;
  pricingBookletUrl: string;
  pricing: {
    websitePackages: Array<{
      name: string;
      tagline: string;
      timeline: string;
      price: string;
      badge?: string;
      highlights: string[];
    }>;
    appPackages: Array<{
      name: string;
      tagline: string;
      timeline: string;
      price: string;
      badge?: string;
      highlights: string[];
    }>;
    seoGrowthPlan: {
      name: string;
      priceRange: string;
      items: string[];
    };
  };
  affiliateNetwork: {
    multinational: Array<{ name: string; logoUrl: string }>;
    local: Array<{ name: string; logoUrl: string }>;
  };
  awards: Array<{ title: string; subtitle: string }>;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    whatsapp: '',
    address: '',
    pricingBookletUrl: '',
    pricing: {
      websitePackages: [],
      appPackages: [],
      seoGrowthPlan: { name: '', priceRange: '', items: [] },
    },
    affiliateNetwork: { multinational: [], local: [] },
    awards: [],
  });
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/content/settings');
      const data = await res.json();
      setSettings((prev) => ({
        ...prev,
        ...data,
        pricing: data?.pricing || prev.pricing,
        affiliateNetwork: {
          multinational: data?.affiliateNetwork?.multinational || prev.affiliateNetwork.multinational,
          local: data?.affiliateNetwork?.local || prev.affiliateNetwork.local,
        },
        awards: data?.awards || prev.awards,
      }));
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings({ ...settings, [key]: value });
    setIsSaved(false);
  };

  const updatePricingPackage = (
    group: 'websitePackages' | 'appPackages',
    index: number,
    patch: Partial<{
      name: string;
      tagline: string;
      timeline: string;
      price: string;
      badge?: string;
      highlights: string[];
    }>,
  ) => {
    setSettings((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [group]: prev.pricing[group].map((p, i) => (i === index ? { ...p, ...patch } : p)),
      },
    }));
    setIsSaved(false);
  };

  const addPricingPackage = (group: 'websitePackages' | 'appPackages') => {
    setSettings((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [group]: [
          ...prev.pricing[group],
          { name: '', tagline: '', timeline: '', price: '', badge: '', highlights: [] },
        ],
      },
    }));
    setIsSaved(false);
  };

  const removePricingPackage = (group: 'websitePackages' | 'appPackages', index: number) => {
    setSettings((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [group]: prev.pricing[group].filter((_, i) => i !== index),
      },
    }));
    setIsSaved(false);
  };

  const updateSeoPlan = (patch: Partial<Settings['pricing']['seoGrowthPlan']>) => {
    setSettings((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        seoGrowthPlan: { ...prev.pricing.seoGrowthPlan, ...patch },
      },
    }));
    setIsSaved(false);
  };

  const updateAffiliate = (
    group: 'multinational' | 'local',
    index: number,
    patch: Partial<{ name: string; logoUrl: string }>,
  ) => {
    const next = {
      ...settings,
      affiliateNetwork: {
        ...settings.affiliateNetwork,
        [group]: settings.affiliateNetwork[group].map((item, i) =>
          i === index ? { ...item, ...patch } : item,
        ),
      },
    };
    setSettings(next);
    setIsSaved(false);
  };

  const addAffiliate = (group: 'multinational' | 'local') => {
    setSettings((prev) => ({
      ...prev,
      affiliateNetwork: {
        ...prev.affiliateNetwork,
        [group]: [...prev.affiliateNetwork[group], { name: '', logoUrl: '' }],
      },
    }));
    setIsSaved(false);
  };

  const removeAffiliate = (group: 'multinational' | 'local', index: number) => {
    setSettings((prev) => ({
      ...prev,
      affiliateNetwork: {
        ...prev.affiliateNetwork,
        [group]: prev.affiliateNetwork[group].filter((_, i) => i !== index),
      },
    }));
    setIsSaved(false);
  };

  const updateAward = (
    index: number,
    patch: Partial<{ title: string; subtitle: string }>,
  ) => {
    setSettings((prev) => ({
      ...prev,
      awards: prev.awards.map((a, i) => (i === index ? { ...a, ...patch } : a)),
    }));
    setIsSaved(false);
  };

  const addAward = () => {
    setSettings((prev) => ({
      ...prev,
      awards: [...prev.awards, { title: '', subtitle: '' }],
    }));
    setIsSaved(false);
  };

  const removeAward = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index),
    }));
    setIsSaved(false);
  };

  const uploadPartnerLogo = async (
    group: 'multinational' | 'local',
    index: number,
    file: File,
  ) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'partners');

      const res = await fetch('/api/content/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data?.url) {
        updateAffiliate(group, index, { logoUrl: data.url });
      } else {
        alert(data?.error || 'Failed to upload image');
      }
    } catch (e) {
      console.error('Failed to upload image:', e);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await fetch('/api/content/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/content/upload-booklet', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        const updatedSettings = { ...settings, pricingBookletUrl: data.url };
        setSettings(updatedSettings);
        
        // Automatically save the settings after upload
        try {
          await fetch('/api/content/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedSettings),
          });
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 3000);
        } catch (saveError) {
          console.error('Failed to save settings after upload:', saveError);
        }
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-slate-900">Site Settings</h1>
        <p className="text-slate-600 mt-2">Configure site-wide information and contact details</p>
      </div>

      {isSaved && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          ✓ Settings saved successfully
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 space-y-6">        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Phone</label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">WhatsApp</label>
              <input
                type="tel"
                value={settings.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <hr className="border-slate-200" />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Changes here will update the corresponding information on your public website. Make sure all contact details are correct before saving.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Save Settings
          </button>
          <button
            className="px-6 py-3 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 font-semibold"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

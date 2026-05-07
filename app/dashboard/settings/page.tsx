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

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Site Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                rows={3}
              />
            </div>
          </div>
        </div>

        <hr className="border-slate-200" />

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Pricing (Editable)</h2>
          <p className="text-sm text-slate-600 mb-4">
            Manage package pricing and included features shown on the public homepage.
          </p>

          {(['websitePackages', 'appPackages'] as const).map((group) => (
            <div key={group} className="mb-10">
              <div className="flex items-center justify-between gap-4 mb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  {group === 'websitePackages' ? 'Website packages' : 'Mobile app packages'}
                </h3>
                <button
                  type="button"
                  onClick={() => addPricingPackage(group)}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-semibold"
                >
                  + Add package
                </button>
              </div>

              {settings.pricing?.[group]?.length ? (
                <div className="space-y-3">
                  {settings.pricing[group].map((pkg, index) => (
                    <div key={`${group}-${index}`} className="rounded-xl border border-slate-200 p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Name</label>
                          <input
                            value={pkg.name || ''}
                            onChange={(e) => updatePricingPackage(group, index, { name: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
                          <input
                            value={pkg.tagline || ''}
                            onChange={(e) => updatePricingPackage(group, index, { tagline: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Timeline</label>
                          <input
                            value={pkg.timeline || ''}
                            onChange={(e) => updatePricingPackage(group, index, { timeline: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Price</label>
                          <input
                            value={pkg.price || ''}
                            onChange={(e) => updatePricingPackage(group, index, { price: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            placeholder="GHS 0"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Badge (optional)</label>
                          <input
                            value={pkg.badge || ''}
                            onChange={(e) => updatePricingPackage(group, index, { badge: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            placeholder="Most popular"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Included features (one per line)
                        </label>
                        <textarea
                          value={(pkg.highlights || []).join('\n')}
                          onChange={(e) =>
                            updatePricingPackage(group, index, {
                              highlights: e.target.value
                                .split('\n')
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg font-mono text-sm"
                          rows={6}
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removePricingPackage(group, index)}
                          className="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold"
                        >
                          Remove package
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-600 rounded-lg border border-dashed border-slate-300 p-4">
                  No packages yet. Click “Add package” to begin.
                </div>
              )}
            </div>
          ))}

          <div className="rounded-xl border border-slate-200 p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">SEO growth plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Name</label>
                <input
                  value={settings.pricing.seoGrowthPlan?.name || ''}
                  onChange={(e) => updateSeoPlan({ name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Price range</label>
                <input
                  value={settings.pricing.seoGrowthPlan?.priceRange || ''}
                  onChange={(e) => updateSeoPlan({ priceRange: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Items (one per line)
                </label>
                <textarea
                  value={(settings.pricing.seoGrowthPlan?.items || []).join('\n')}
                  onChange={(e) =>
                    updateSeoPlan({
                      items: e.target.value
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg font-mono text-sm"
                  rows={5}
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-200" />

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Pricing Booklet</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Upload Pricing Booklet (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploading && <p className="text-sm text-slate-600 mt-2">Uploading...</p>}
              {settings.pricingBookletUrl && (
                <div className="mt-2">
                  <a
                    href={`/api/content/view-booklet?file=${encodeURIComponent(settings.pricingBookletUrl.split('/').pop() || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View current booklet →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="border-slate-200" />

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Affiliate Network</h2>
          <p className="text-sm text-slate-600 mb-4">
            Add partner logos to showcase trust (like the “Affiliate Network” section on Atlas).
          </p>

          {(['multinational', 'local'] as const).map((group) => (
            <div key={group} className="mb-8">
              <div className="flex items-center justify-between gap-4 mb-3">
                <h3 className="text-sm font-bold text-slate-900 capitalize">
                  {group === 'multinational' ? 'Multinational partners' : 'Local partners'}
                </h3>
                <button
                  type="button"
                  onClick={() => addAffiliate(group)}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-semibold"
                >
                  + Add partner
                </button>
              </div>

              {settings.affiliateNetwork?.[group]?.length ? (
                <div className="space-y-3">
                  {settings.affiliateNetwork[group].map((partner, index) => (
                    <div
                      key={`${group}-${index}`}
                      className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-3 items-end rounded-lg border border-slate-200 p-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Partner name
                        </label>
                        <input
                          type="text"
                          value={partner.name || ''}
                          onChange={(e) => updateAffiliate(group, index, { name: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Logo URL
                        </label>
                        <input
                          type="url"
                          value={partner.logoUrl || ''}
                          onChange={(e) => updateAffiliate(group, index, { logoUrl: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                          placeholder="/uploads/partners/..."
                        />
                        <div className="mt-2 flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*,.svg"
                            disabled={uploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              uploadPartnerLogo(group, index, file);
                              e.currentTarget.value = '';
                            }}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-900 hover:file:bg-slate-200"
                          />
                          {partner.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={partner.logoUrl}
                              alt={partner.name || 'Partner logo'}
                              className="h-10 w-auto max-w-[140px] object-contain rounded bg-white border border-slate-100 px-2"
                            />
                          ) : null}
                        </div>
                      </div>
                      <div className="flex md:justify-end">
                        <button
                          type="button"
                          onClick={() => removeAffiliate(group, index)}
                          className="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-600 rounded-lg border border-dashed border-slate-300 p-4">
                  No partners yet. Click “Add partner” to begin.
                </div>
              )}
            </div>
          ))}
        </div>

        <hr className="border-slate-200" />

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Awards</h2>
          <p className="text-sm text-slate-600 mb-4">
            Add awards/certifications to strengthen credibility.
          </p>

          <div className="flex items-center justify-between gap-4 mb-3">
            <div />
            <button
              type="button"
              onClick={addAward}
              className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-semibold"
            >
              + Add award
            </button>
          </div>

          {settings.awards?.length ? (
            <div className="space-y-3">
              {settings.awards.map((award, index) => (
                <div
                  key={`award-${index}`}
                  className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-3 items-end rounded-lg border border-slate-200 p-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={award.title || ''}
                      onChange={(e) => updateAward(index, { title: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={award.subtitle || ''}
                      onChange={(e) => updateAward(index, { subtitle: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="flex md:justify-end">
                    <button
                      type="button"
                      onClick={() => removeAward(index)}
                      className="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-600 rounded-lg border border-dashed border-slate-300 p-4">
              No awards yet. Click “Add award” to begin.
            </div>
          )}
        </div>

        <hr className="border-slate-200" />

        <div>
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

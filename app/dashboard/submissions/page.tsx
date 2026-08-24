'use client';

import { useState, useEffect } from 'react';

interface Submission {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  industry?: string;
  building?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  urgency?: string;
  coupon?: string;
  couponLabel?: string;
  referral?: string;
  packageName?: string;
  packagePrice?: string;
  source?: string;
  message?: string;
  submittedAt: string;
}

function whatsappHref(phone?: string) {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProjectType, setFilterProjectType] = useState('All');
  const [filterUrgency, setFilterUrgency] = useState('All');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/content/contact-submissions');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setSubmissions(data);
      } else {
        console.error('Failed to fetch submissions:', data?.error || 'Unknown error');
        setSubmissions([]);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const res = await fetch(`/api/content/contact-submissions?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSubmissions(submissions.filter((s) => s.id !== id));
        if (selectedSubmission?.id === id) setSelectedSubmission(null);
      } else {
        alert('Failed to delete submission');
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Error deleting submission');
    }
  };

  const projectTypes = [
    'All',
    ...Array.from(
      new Set(
        submissions
          .flatMap((s) => [s.building, s.projectType].filter(Boolean) as string[])
      )
    ),
  ];
  const urgencyLevels = ['All', ...Array.from(new Set(submissions.map((s) => s.urgency).filter(Boolean) as string[]))];

  const filteredSubmissions = submissions.filter((s) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (s.name || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.phone || '').toLowerCase().includes(q) ||
      (s.company || '').toLowerCase().includes(q) ||
      (s.industry || '').toLowerCase().includes(q) ||
      (s.message || '').toLowerCase().includes(q) ||
      (s.source || '').toLowerCase().includes(q);

    const matchesType =
      filterProjectType === 'All' ||
      s.projectType === filterProjectType ||
      s.building === filterProjectType;
    const matchesUrgency = filterUrgency === 'All' || s.urgency === filterUrgency;

    return matchesSearch && matchesType && matchesUrgency;
  });

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
        <h1 className="text-3xl font-bold text-slate-900">Contact Form Submissions</h1>
        <p className="text-slate-600 mt-2">
          Leads from /forms, WhatsApp offer, contact page, and book-a-meeting
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 md:space-y-0 md:flex md:gap-4 md:items-center">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search name, phone, industry, source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
              Project
            </label>
            <select
              value={filterProjectType}
              onChange={(e) => setFilterProjectType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
              Urgency
            </label>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {urgencyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
        {(searchTerm || filterProjectType !== 'All' || filterUrgency !== 'All') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterProjectType('All');
              setFilterUrgency('All');
            }}
            className="text-sm text-blue-600 font-semibold hover:text-blue-700 whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">No submissions found matching your filters</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSubmissions.map((submission) => {
            const wa = whatsappHref(submission.phone);
            const headline =
              submission.building ||
              submission.packageName ||
              submission.projectType ||
              submission.industry ||
              'Lead';

            return (
              <div
                key={submission.id}
                className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() =>
                  setSelectedSubmission(selectedSubmission?.id === submission.id ? null : submission)
                }
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900">
                      {submission.name || 'Anonymous'}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 truncate">{headline}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm">
                      {submission.phone ? (
                        <span className="text-slate-600">
                          📱{' '}
                          <a
                            href={`tel:${submission.phone}`}
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {submission.phone}
                          </a>
                        </span>
                      ) : null}
                      {submission.email ? (
                        <span className="text-slate-600">
                          📧{' '}
                          <a
                            href={`mailto:${submission.email}`}
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {submission.email}
                          </a>
                        </span>
                      ) : null}
                      {submission.source ? (
                        <span className="text-slate-500">via {submission.source}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {submission.urgency ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700">
                        {submission.urgency}
                      </span>
                    ) : null}
                    <p className="text-xs text-slate-600 mt-2">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedSubmission?.id === submission.id && (
                  <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {submission.building ? (
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-1">
                            Building
                          </label>
                          <p className="text-slate-600">{submission.building}</p>
                        </div>
                      ) : null}
                      {submission.projectType ? (
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-1">
                            Project type
                          </label>
                          <p className="text-slate-600">{submission.projectType}</p>
                        </div>
                      ) : null}
                      {submission.budget ? (
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-1">
                            Budget
                          </label>
                          <p className="text-slate-600">{submission.budget}</p>
                        </div>
                      ) : null}
                      {submission.industry ? (
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-1">
                            Industry
                          </label>
                          <p className="text-slate-600">{submission.industry}</p>
                        </div>
                      ) : null}
                      {submission.urgency ? (
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-1">
                            Urgency
                          </label>
                          <p className="text-slate-600">{submission.urgency}</p>
                        </div>
                      ) : null}
                      {submission.referral ? (
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-1">
                            Heard about us
                          </label>
                          <p className="text-slate-600">{submission.referral}</p>
                        </div>
                      ) : null}
                      {submission.coupon ? (
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-1">
                            Coupon
                          </label>
                          <p className="text-slate-600">
                            {submission.coupon}
                            {submission.couponLabel ? ` (${submission.couponLabel})` : ''}
                          </p>
                        </div>
                      ) : null}
                      {submission.packageName ? (
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-1">
                            Package
                          </label>
                          <p className="text-slate-600">
                            {submission.packageName}
                            {submission.packagePrice ? ` — ${submission.packagePrice}` : ''}
                          </p>
                        </div>
                      ) : null}
                      {submission.timeline ? (
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-1">
                            Timeline
                          </label>
                          <p className="text-slate-600">{submission.timeline}</p>
                        </div>
                      ) : null}
                      {submission.company ? (
                        <div>
                          <label className="block text-sm font-semibold text-slate-900 mb-1">
                            Company
                          </label>
                          <p className="text-slate-600">{submission.company}</p>
                        </div>
                      ) : null}
                    </div>
                    {submission.message ? (
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1">
                          Message
                        </label>
                        <p className="text-slate-600 whitespace-pre-wrap">{submission.message}</p>
                      </div>
                    ) : null}
                    <div className="flex flex-wrap gap-3 pt-4">
                      {wa ? (
                        <a
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          WhatsApp
                        </a>
                      ) : null}
                      {submission.phone ? (
                        <a
                          href={`tel:${submission.phone}`}
                          className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-semibold text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Call
                        </a>
                      ) : null}
                      {submission.email ? (
                        <a
                          href={`mailto:${submission.email}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Reply via Email
                        </a>
                      ) : null}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(submission.id);
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-semibold text-sm transition-colors border border-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  program: string;
  level: string;
  startDate: string;
  duration: string;
  message: string;
  enrolled?: boolean;
  image?: string;
  submittedAt: string;
}

export default function InternshipSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterDuration, setFilterDuration] = useState('All');
  const [filterStartDate, setFilterStartDate] = useState('All');
  const [sortField, setSortField] = useState<string>('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/content/internship-submissions');
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      const res = await fetch(`/api/content/internship-submissions?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSubmissions(submissions.filter((s) => s.id !== id));
        if (selectedSubmission?.id === id) setSelectedSubmission(null);
      } else {
        alert('Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Error deleting application');
    }
  };

  const handleToggleEnrolled = async (submission: Submission) => {
    try {
      const res = await fetch('/api/content/internship-submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submission.id, enrolled: !submission.enrolled }),
      });
      if (res.ok) {
        setSubmissions(submissions.map((s) =>
          s.id === submission.id ? { ...s, enrolled: !s.enrolled } : s
        ));
      } else {
        alert('Failed to update enrollment status');
      }
    } catch (error) {
      console.error('Error updating enrollment status:', error);
      alert('Error updating enrollment status');
    }
  };

  const handleUploadImage = async (submission: Submission, file: File | null) => {
    if (!file) return;

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', 'interns');

      const uploadRes = await fetch('/api/content/upload-image', {
        method: 'POST',
        body: uploadData,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok || !uploadJson.url) {
        alert('Failed to upload image');
        return;
      }

      const res = await fetch('/api/content/internship-submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submission.id, image: uploadJson.url }),
      });
      if (res.ok) {
        setSubmissions(submissions.map((s) =>
          s.id === submission.id ? { ...s, image: uploadJson.url } : s
        ));
      } else {
        alert('Failed to save image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };

  const programs = ['All', ...Array.from(new Set(submissions.map(s => s.program).filter(Boolean))).sort()];
  const levels = ['All', ...Array.from(new Set(submissions.map(s => s.level).filter(Boolean))).sort()];
  const durations = ['All', ...Array.from(new Set(submissions.map(s => s.duration).filter(Boolean))).sort()];
  const startDates = ['All', ...Array.from(new Set(submissions.map(s => s.startDate).filter(Boolean))).sort()];

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = 
      (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.school || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.program || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.message && s.message.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesProgram = filterProgram === 'All' || s.program === filterProgram;
    const matchesLevel = filterLevel === 'All' || s.level === filterLevel;
    const matchesDuration = filterDuration === 'All' || s.duration === filterDuration;
    const matchesStartDate = filterStartDate === 'All' || s.startDate === filterStartDate;

    return matchesSearch && matchesProgram && matchesLevel && matchesDuration && matchesStartDate;
  }).sort((a, b) => {
    let comparison = 0;
    const field = sortField as keyof Submission;
    const av = (a[field] ?? "") as string;
    const bv = (b[field] ?? "") as string;
    
    if (av < bv) comparison = -1;
    if (av > bv) comparison = 1;
    
    return sortOrder === 'asc' ? comparison : -comparison;
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
        <h1 className="text-3xl font-bold text-slate-900">Internship Applications</h1>
        <p className="text-slate-600 mt-2">View and manage internship and attachment requests</p>
      </div>

      {/* Filters & Search Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          {/* Search Bar */}
          <div className="lg:col-span-5 relative">
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Search Applications</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Name, email, school, program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Sort Controls */}
          <div className="lg:col-span-4 flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Sort By</label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50/50"
              >
                <option value="submittedAt">Submission Date</option>
                <option value="name">Name</option>
                <option value="level">Level</option>
                <option value="duration">Duration</option>
                <option value="startDate">Start Date</option>
              </select>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white h-[42px] flex items-center justify-center min-w-[42px]"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <span className="text-blue-600 font-bold">{sortOrder === 'asc' ? '↑' : '↓'}</span>
            </button>
          </div>

          {/* Clear Button */}
          <div className="lg:col-span-3 flex justify-end pb-1">
            { (searchTerm || filterProgram !== 'All' || filterLevel !== 'All' || filterDuration !== 'All' || filterStartDate !== 'All' || sortField !== 'submittedAt' || sortOrder !== 'desc') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterProgram('All');
                  setFilterLevel('All');
                  setFilterDuration('All');
                  setFilterStartDate('All');
                  setSortField('submittedAt');
                  setSortOrder('desc');
                }}
                className="text-sm text-red-600 font-semibold hover:text-red-700 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50"
              >
                <span>✕</span> Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Program</label>
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              {programs.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Level</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              {levels.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Duration</label>
            <select
              value={filterDuration}
              onChange={(e) => setFilterDuration(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              {durations.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Start Date</label>
            <select
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              {startDates.map(sd => (
                <option key={sd} value={sd}>{sd}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">No applications found matching your filters</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedSubmission(selectedSubmission?.id === submission.id ? null : submission)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{submission.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{submission.school} · {submission.program}</p>
                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="text-slate-600">
                      📧 <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline" onClick={e => e.stopPropagation()}>{submission.email}</a>
                    </span>
                    <span className="text-slate-600">
                      📱 <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline" onClick={e => e.stopPropagation()}>{submission.phone}</a>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-purple-50 text-purple-700">
                    {submission.duration || 'Duration TBD'}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                      submission.enrolled
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {submission.enrolled ? '● Enrolled' : '○ Applied'}
                  </span>
                  <p className="text-xs text-slate-600 mt-2">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedSubmission?.id === submission.id && (
                <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1">Level / Year</label>
                      <p className="text-slate-600">{submission.level}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1">Start Date</label>
                      <p className="text-slate-600">{submission.startDate || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1">Duration</label>
                      <p className="text-slate-600">{submission.duration || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1">Program</label>
                      <p className="text-slate-600">{submission.program}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-1">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                        {submission.image ? (
                          <img src={submission.image} alt={submission.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl font-bold">
                            {(submission.name || '?').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadImage(submission, e.target.files?.[0] || null)}
                          className="text-sm text-slate-500"
                        />
                        <p className="text-xs text-slate-400">
                          Shown on the internship page intern cards
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-1">About</label>
                    <p className="text-slate-600 whitespace-pre-wrap">{submission.message || 'No message provided'}</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <a
                      href={`mailto:${submission.email}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm"
                      onClick={e => e.stopPropagation()}
                    >
                      Reply via Email
                    </a>
                    <a
                      href={`tel:${submission.phone}`}
                      className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-semibold text-sm"
                      onClick={e => e.stopPropagation()}
                    >
                      Call
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleEnrolled(submission);
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors border ${
                        submission.enrolled
                          ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                      }`}
                    >
                      {submission.enrolled ? 'Unenroll' : 'Mark as Enrolled'}
                    </button>
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
          ))}
        </div>
      )}
    </div>
  );
}

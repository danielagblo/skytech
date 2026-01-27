'use client';

import { useState, useEffect } from 'react';

interface Submission {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  urgency: string;
  message: string;
  submittedAt: string;
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/content/contact-submissions');
      const data = await res.json();
      setSubmissions(data.reverse());
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-slate-900">Contact Form Submissions</h1>
        <p className="text-slate-600 mt-2">View and manage all contact form submissions from your website</p>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-600">No submissions yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedSubmission(selectedSubmission?.id === submission.id ? null : submission)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{submission.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{submission.company}</p>
                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="text-slate-600">
                      📧 <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">{submission.email}</a>
                    </span>
                    <span className="text-slate-600">
                      📱 <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline">{submission.phone}</a>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700">
                    {submission.urgency}
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
                      <label className="block text-sm font-semibold text-slate-900 mb-1">Project Type</label>
                      <p className="text-slate-600">{submission.projectType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1">Budget</label>
                      <p className="text-slate-600">{submission.budget}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1">Timeline</label>
                      <p className="text-slate-600">{submission.timeline}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1">Urgency</label>
                      <p className="text-slate-600">{submission.urgency}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-1">Message</label>
                    <p className="text-slate-600 whitespace-pre-wrap">{submission.message}</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <a
                      href={`mailto:${submission.email}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm"
                    >
                      Reply via Email
                    </a>
                    <a
                      href={`tel:${submission.phone}`}
                      className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 font-semibold text-sm"
                    >
                      Call
                    </a>
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

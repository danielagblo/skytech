import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchSettings, fetchTeam } from '../utils/api';

export default function Contact() {
  const [settings, setSettings] = useState({
    siteName: 'SkyTech',
    contactEmail: 'hello@skytech.com',
    contactPhone: '+1 (555) 123-4567',
    whatsapp: '+233 20 123 4567',
    address: 'Tech Hub, San Francisco, CA 94105, USA',
  });

  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchSettings();
      setSettings(data);
    };
    const loadTeam = async () => {
      const data = await fetchTeam();
      setTeamMembers(data);
    };
    loadSettings();
    loadTeam();
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    urgency: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : window.location.origin;
      
      // Send to admin API
      const res = await fetch(`${adminUrl}/api/content/contact-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
        }),
      });
      
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setFormData({ name: '', email: '', phone: '', company: '', projectType: '', budget: '', timeline: '', urgency: '', message: '' });
          setSubmitted(false);
        }, 3000);
      } else {
        const error = await res.json();
        console.error('Server error:', error);
      }
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact SkyTech - Get In Touch</title>
        <meta name="description" content="Contact SkyTech for software development inquiries. Get in touch with our team today." />
        <meta property="og:title" content="Contact SkyTech - Get In Touch" />
        <meta property="og:description" content="Contact SkyTech for software development inquiries." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 px-4">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute left-10 -top-10 h-72 w-72 rounded-full bg-blue-600/40 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl" />
        </div>
        <div className="section-shell relative space-y-6">
          <span className="pill">Contact</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-3xl">Let’s scope your next release together.</h1>
          <p className="text-lg text-white/85 max-w-3xl">Tell us about your goals and constraints. We’ll respond within one business day with next steps.</p>
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            <span className="rounded-full bg-white/10 px-4 py-2 border border-white/15">Avg. response: under 24h</span>
            <span className="rounded-full bg-white/10 px-4 py-2 border border-white/15">Global remote teams</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="section-shell">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr,1.1fr] gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-50 border border-slate-100 p-6">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Contact information</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📧</div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">Email</h3>
                      <a href={`mailto:${settings.contactEmail}`} className="text-blue-700 text-sm font-semibold hover:underline">{settings.contactEmail}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📱</div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">Phone</h3>
                      <a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`} className="text-blue-700 text-sm font-semibold hover:underline">{settings.contactPhone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">💬</div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">WhatsApp</h3>
                      <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} className="text-blue-700 text-sm font-semibold hover:underline">{settings.whatsapp}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">📍</div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">Address</h3>
                      <p className="text-sm text-slate-600">{settings.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                <iframe
                  title="Bricsky on Google Maps"
                  src="https://maps.google.com/maps?q=Bricsky&output=embed"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="rounded-3xl bg-slate-900 text-white p-6 space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-200">Need something fast?</p>
                <p className="text-lg">We can assemble a discovery sprint in under 7 days for time-sensitive launches.</p>
                <p className="text-sm text-white/80">Office hours: Mon–Fri, 9am–6pm PT</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-panel rounded-3xl p-8">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Tell us about your project</h2>
              <p className="text-sm text-slate-600 mb-6">A few details help us prepare the right next steps.</p>
              
              {submitted && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl mb-6">
                  Thank you! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Phone <span className="text-red-600">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Company <span className="text-slate-500 text-xs">(optional)</span></label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white"
                      placeholder="Your company (optional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Project type <span className="text-slate-500 text-xs">(optional)</span></label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white"
                    >
                      <option value="">Select one (optional)</option>
                      <option value="web">Web app / platform</option>
                      <option value="mobile">Mobile app</option>
                      <option value="cloud">Cloud / DevOps</option>
                      <option value="data">Data / AI</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Budget (GHS)</label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      min="0"
                      step="500"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white"
                      placeholder="e.g., 50000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Timeline</label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white"
                    >
                      <option value="">Select timeline</option>
                      <option value="<1mo">Under 1 month</option>
                      <option value="1-3mo">1–3 months</option>
                      <option value="3-6mo">3–6 months</option>
                      <option value="over-6mo">6+ months</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">Urgency</label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white"
                    >
                      <option value="">How soon?</option>
                      <option value="asap">Immediate</option>
                      <option value="this-quarter">This quarter</option>
                      <option value="next-quarter">Next quarter</option>
                      <option value="exploring">Exploring options</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Project details</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white"
                    placeholder="What are you building? Timelines? Success metrics?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary justify-center"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-slate-50">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <span className="pill">Meet the team</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Your SkyTech leads</h2>
            <p className="text-slate-600 max-w-2xl">Core leaders who guide delivery and keep communication smooth.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((person) => (
              <div key={person.id} className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="h-12 w-12 rounded-full object-cover border border-slate-100"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <p className="text-lg font-bold text-slate-900">{person.name}</p>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mt-1">
                      {person.role}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3">{person.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

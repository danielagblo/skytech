/* eslint-disable react-refresh/only-export-components */
import InternshipFormClient from "../../../components/InternshipFormClient";

export const metadata = {
  title: "Internship / Attachment - SkyTech",
  description: "Apply for an internship or attachment at SkyTech.",
};

export default function InternshipPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white py-24 px-4">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-blue-600/40 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-400/40 blur-3xl" />
        </div>
        <div className="section-shell relative space-y-6">
          <span className="pill">Internship / Attachment</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-3xl">
            Apply for an internship or attachment.
          </h1>
          <p className="text-lg text-white/85 max-w-3xl">
            Fill the form below. We will review your request and contact you.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="section-shell grid grid-cols-1 lg:grid-cols-[0.9fr,1.1fr] gap-12">
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-50 border border-slate-100 p-6">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Who can apply</h2>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />Students or recent graduates</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />Basic skills in web or mobile</li>
                <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />Ready to learn and work with a team</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-slate-900 text-white p-6 space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-200">Response time</p>
              <p className="text-lg">We reply within 1–3 business days.</p>
              <p className="text-sm text-white/80">Mon–Fri, 9am–6pm</p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Internship form</h2>
            <p className="text-sm text-slate-600 mb-6">Please fill in your details.</p>
            <InternshipFormClient />
          </div>
        </div>
      </section>
    </>
  );
}

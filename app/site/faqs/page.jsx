import Link from "next/link";
import { getFAQs } from "../../lib/faqs";
import FAQAccordion from "../../../components/FAQAccordion";

export const metadata = {
  title: "Frequently Asked Questions - Skytech Ghana",
  description: "Everything you need to know about our process, pricing, and services.",
};

export const dynamic = 'force-dynamic';

export default async function FAQPage() {
  const faqs = await getFAQs();

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="section-shell space-y-16">
        <div className="text-center space-y-4">
          <span className="pill">Support</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our platform is built to help you work smarter, not harder. It adapts to your needs and supports your goals. Make the most of every feature.
          </p>
        </div>

        {faqs.length > 0 ? (
          <FAQAccordion faqs={faqs} />
        ) : (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-slate-400">
            No FAQs available at the moment.
          </div>
        )}

        <div className="glass-panel rounded-[2.5rem] p-12 text-center space-y-6 border-slate-100 bg-slate-50/50">
          <h2 className="text-2xl font-bold text-slate-900">Still have questions?</h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Can't find the answer you're looking for? Reach out to our team and we'll get back to you as soon as possible.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/site/contact" className="btn-primary px-8 py-3 rounded-full bg-blue-600 text-white font-bold">Contact Support</Link>
            <Link href="/site/services" className="btn-secondary px-8 py-3 rounded-full border border-slate-200 font-bold">View Services</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

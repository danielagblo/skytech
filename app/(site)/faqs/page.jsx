import Link from "next/link";
import { getFAQs } from "../../lib/faqs";
import FAQSection from "../../../components/skytech/sections/FAQ";
import { groupFAQs } from "../../../components/skytech/sections/faqGroup";

export const metadata = {
  title: "Frequently Asked Questions - Skytech Ghana",
  description: "Everything you need to know about our process, pricing, and services.",
};

export const dynamic = 'force-dynamic';

export default async function FAQPage() {
  const faqs = await getFAQs();

  return (
    <main className="min-h-screen bg-[#F6F4F0]">
      <section className="studio-hero">
        <div className="section-shell max-w-3xl">
          <span className="eyebrow">Support</span>
          <h1 className="section-title mt-5">Frequently asked questions</h1>
          <p className="section-lead mt-5">
            Practical answers about process, pricing, and the way we work with clients.
          </p>
        </div>
      </section>
      {faqs.length > 0 ? (
        <FAQSection faqs={groupFAQs(faqs)} showHeading={false} />
      ) : (
        <div className="section-shell py-20 text-[#5C574F]">
          No FAQs available at the moment.
        </div>
      )}

      <div className="section-shell pb-20">
        <div className="border border-[#E3DDD4] bg-white p-8 md:p-10">
          <h2 className="font-display text-2xl font-medium text-[#141413]">Still have questions?</h2>
          <p className="mt-3 max-w-xl text-[#5C574F]">
            If the answer is not here, write to the team and we will reply.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">Contact</Link>
            <Link href="/services" className="btn-secondary">View services</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";

const sections = [
  {
    title: "Company",
    links: [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Internship", path: "/internship" },
      { name: "Project Gallery", path: "/gallery" },
      { name: "Case Studies", path: "/case-studies" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "Web Solutions", path: "/services" },
      { name: "Security Systems", path: "/services/security-systems" },
      { name: "SEO & Growth", path: "/seo" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Pricing", path: "/pricing" },
      { name: "Insights", path: "/insights" },
      { name: "FAQs", path: "/faqs" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", path: "/privacy-policy" },
      { name: "Terms of Use", path: "/terms-of-use" },
    ],
  },
];

export const metadata = {
  title: "Sitemap - Skytech Ghana",
  description:
    "Browse every page on the Skytech Ghana website, from company information and services to insights, FAQs, and legal pages.",
};

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-[#F6F4F0] pb-24">
      <section className="studio-hero">
        <div className="section-shell max-w-3xl">
          <span className="eyebrow">Index</span>
          <h1 className="section-title mt-5">Sitemap</h1>
          <p className="section-lead mt-5">Everything on the Skytech Ghana website, set out for easy browsing.</p>
        </div>
      </section>
      <div className="section-shell mx-auto w-full max-w-4xl py-16">
        <div className="grid gap-12 md:grid-cols-2">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="border-b border-[#E3DDD4] pb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#1E5AC8]">
                {section.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="group flex items-baseline gap-2 text-slate-700 transition hover:text-brand-600"
                    >
                      <span className="text-slate-300 transition group-hover:text-brand-400">/</span>
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
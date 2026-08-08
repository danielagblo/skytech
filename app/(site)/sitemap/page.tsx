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
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="section-shell mx-auto w-full max-w-4xl px-6">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-slate-900 sm:text-5xl">
          Sitemap
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
          Everything on the Skytech Ghana website, organized for easy browsing.
        </p>

        <div className="mt-14 grid gap-12 md:grid-cols-2">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="border-b border-slate-100 pb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">
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
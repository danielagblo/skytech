import { getPricing } from "../../lib/pricing";
import { getAffiliates } from "../../lib/affiliates";
import LandingPageContent from "../../../components/skytech/sections/landing/LandingPageContent";

export const dynamic = "force-dynamic";

const DEFAULT_CATEGORIES = [
  {
    category: "web",
    label: "Website Rates",
    packages: [
      {
        name: "Basic website package",
        tier: "Startups & Small Businesses",
        price: "1,500",
        usd: "100",
        renewal: "1,000",
        interval: "1 - 2 weeks",
        featured: false,
        highlights: [
          "5 - 6 pages modern responsive website",
          "Homepage, About, Services, Contact",
          "Google indexing",
          "Whats app integration",
          "Google maps & social media links",
          "1year SSL + Domain + Hosting",
          "Responsive interface",
          "Admin panel [EXCLUDED]",
        ],
      },
      {
        name: "Basic website package",
        tier: "Startups & Small Businesses",
        price: "2,500",
        usd: "175",
        renewal: "1,000",
        interval: "1 - 2 weeks",
        featured: false,
        highlights: [
          "5 - 6 pages modern responsive website",
          "Homepage, About, Services, Contact",
          "Google indexing",
          "Whats app integration",
          "Google maps & social media links",
          "1year SSL + Domain + Hosting",
          "Responsive interface",
          "Admin panel",
        ],
      },
      {
        name: "Standard Business Package",
        tier: "Most Popular - Growing Brands",
        price: "6,500",
        usd: "450",
        renewal: "1,500",
        interval: "2-3 weeks",
        featured: true,
        highlights: [
          "Everything in basic",
          "Advanced SEO",
          "Custom contact forms",
          "Live chat system",
          "Testimonials, portfolio, gallery",
          "Blog with admin access (CMS)",
          "Analytics dashboard",
        ],
      },
    ],
  },
  {
    category: "mobile",
    label: "Mobile App Rates",
    packages: [],
  },
  {
    category: "marketing",
    label: "Marketing Rates",
    packages: [],
  },
];

export default async function LandingPage() {
  const [pricing, partnersData] = await Promise.all([getPricing(), getAffiliates()]);
  
  // Transform to plain object for client
  const serializablePricing = JSON.parse(JSON.stringify(pricing));
  const categories = serializablePricing.length > 0 ? serializablePricing : DEFAULT_CATEGORIES;
  
  const allPartners = (partnersData || []).filter((p) => p?.logoUrl || p?.name);

  return <LandingPageContent categories={categories} partners={allPartners} />;
}


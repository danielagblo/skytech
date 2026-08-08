import { getPricing } from "../../lib/pricing";
import LandingPageContent, { type Package } from "../../../components/skytech/sections/landing/LandingPageContent";

export const dynamic = "force-dynamic";

const DEFAULT_PACKAGES: Package[] = [
  {
    name: "Basic website package",
    audience: "Startups & Small Businesses",
    timeline: "1 - 2 weeks",
    features: [
      { text: "5 - 6 pages modern responsive website" },
      { text: "Homepage, About, Services, Contact" },
      { text: "Google indexing" },
      { text: "Whats app integration" },
      { text: "Google maps & social media links" },
      { text: "1year SSL + Domain + Hosting" },
      { text: "Responsive interface" },
      { text: "Admin panel", excluded: true },
    ],
    price: "GHC 1,500",
    renewal: "Renews only at GHC 1,000/yr",
  },
  {
    name: "Basic website package",
    audience: "Startups & Small Businesses",
    timeline: "1 - 2 weeks",
    features: [
      { text: "5 - 6 pages modern responsive website" },
      { text: "Homepage, About, Services, Contact" },
      { text: "Google indexing" },
      { text: "Whats app integration" },
      { text: "Google maps & social media links" },
      { text: "1year SSL + Domain + Hosting" },
      { text: "Responsive interface" },
      { text: "Admin panel" },
    ],
    price: "GHC 2,500",
    renewal: "Renews only at GHC 1,000/yr",
  },
  {
    name: "Standard Business Package",
    audience: "Most Popular - Growing Brands",
    timeline: "2-3 weeks",
    features: [
      { text: "Everything in basic" },
      { text: "Advanced SEO" },
      { text: "Custom contact forms" },
      { text: "Live chat system" },
      { text: "Testimonials, portfolio, gallery" },
      { text: "Blog with admin access (CMS)" },
      { text: "Analytics dashboard" },
    ],
    price: "GHC 6,500",
    renewal: "Renews only at GHC 1,500/yr",
    featured: true,
  },
];

function toPackage(pkg: {
  name: string;
  tier?: string;
  price?: string;
  renewal?: string;
  interval?: string;
  featured?: boolean;
  highlights?: string[];
}): Package {
  return {
    name: pkg.name,
    audience: pkg.tier || "Skytech Ghana",
    timeline: pkg.interval || "1 - 2 weeks",
    features: (pkg.highlights || []).map((h) => ({ text: h })),
    price: pkg.price ? `GHC ${pkg.price}` : "GHC 0",
    renewal: pkg.renewal ? `Renews only at GHC ${pkg.renewal}/yr` : "",
    featured: !!pkg.featured,
  };
}

export default async function LandingPage() {
  const pricing = await getPricing();
  const packages =
    pricing.length > 0
      ? pricing.flatMap((cat) => (cat.packages || []).map(toPackage))
      : DEFAULT_PACKAGES;

  return <LandingPageContent packages={packages} />;
}

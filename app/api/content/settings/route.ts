import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Settings from "../../../models/Settings";

const SEEDED_AFFILIATE_NETWORK = {
  multinational: [
    { name: "Tullow Ghana Limited", logoUrl: "" },
    { name: "Anadarko WTCP Company", logoUrl: "" },
    { name: "Newmont Ghana Limited", logoUrl: "" },
    { name: "Guinness Ghana Limited", logoUrl: "" },
    { name: "Sinopec Company Limited", logoUrl: "" },
    { name: "Cadbury", logoUrl: "" },
    { name: "Delta Air Lines", logoUrl: "" },
    { name: "Quantum Terminals", logoUrl: "" },
    { name: "Technip", logoUrl: "" },
    { name: "Korea Exim Bank", logoUrl: "" },
    { name: "Pecan Energies", logoUrl: "" },
    { name: "LUKoil", logoUrl: "" },
  ],
  local: [
    { name: "Oxfam Ghana", logoUrl: "" },
    { name: "Databank Ghana", logoUrl: "" },
    { name: "NHIA", logoUrl: "" },
    { name: "Korle-Bu Teaching Hospital", logoUrl: "" },
    { name: "Reime Ghana", logoUrl: "" },
    { name: "ATS", logoUrl: "" },
    { name: "Danish Embassy", logoUrl: "" },
    { name: "District Grand Lodge", logoUrl: "" },
    { name: "Claron Health International", logoUrl: "" },
    { name: "Tonaton", logoUrl: "" },
    { name: "Consika", logoUrl: "" },
    { name: "Energem Ltd", logoUrl: "" },
    { name: "Cardinal Petroleum", logoUrl: "" },
    { name: "Bayfields", logoUrl: "" },
    { name: "Ecobank", logoUrl: "" },
    { name: "Stanbic Bank", logoUrl: "" },
    { name: "Kulendi@Law", logoUrl: "" },
    { name: "Faibille & Faibille", logoUrl: "" },
    { name: "Charterhouse", logoUrl: "" },
  ],
};

const SEEDED_AWARDS = [
  {
    title: "Industry excellence",
    subtitle: "Recognized for outstanding service delivery and professionalism.",
  },
  {
    title: "Regional distinction",
    subtitle: "Trusted for quality and reliability across multiple regions.",
  },
  {
    title: "National legacy",
    subtitle: "A track record of consistent delivery and long-term partnerships.",
  },
];

const SEEDED_PRICING = {
  websitePackages: [
    {
      name: "Basic Website Package",
      tagline: "Best for Startups & Small Businesses",
      timeline: "3–8 weeks",
      price: "GHS 2,500",
      badge: "",
      highlights: [
        "5–6 page modern responsive website",
        "Homepage, About, Services, Contact",
        "Basic SEO setup",
        "WhatsApp chat integration",
        "1 business email (info@yourbusiness.com)",
        "Google Maps & social media links",
        "Mobile optimization",
        "Free SSL certificate",
        "6 months support",
        "Free speed optimization",
        "Free hosting for 12 months",
      ],
    },
    {
      name: "Standard Business Package",
      tagline: "Most Popular – For Growing Brands",
      timeline: "2–3 months",
      price: "GHS 6,500",
      badge: "Most popular",
      highlights: [
        "10–12 pages",
        "Advanced SEO (keywords, ranking, metadata, indexing)",
        "Custom contact forms + automated email responses",
        "Live chat system",
        "Testimonials, portfolio, gallery",
        "Blog with admin access (CMS)",
        "Analytics dashboard (visitors, insights, conversions)",
        "3 business emails",
        "Security hardening",
        "Google Business Profile optimization",
      ],
    },
    {
      name: "E-commerce/Booking Package",
      tagline: "For Retail, Restaurants, Real Estate & Service Businesses",
      timeline: "3–6 months",
      price: "GHS 25,000",
      badge: "",
      highlights: [
        "Full online store or booking system",
        "Product uploads (up to 50 items)",
        "Payment integrations (Visa, Momo, Paystack)",
        "Stock management",
        "Coupon/discount system",
        "Cart abandonment recovery",
        "Automated order emails",
        "Secure dashboard for product & sales control",
        "Advanced SEO + schema for Google",
        "Live chat + WhatsApp + support desk",
        "5 business emails",
        "Free analytics setup (Google Analytics + Search Console)",
      ],
    },
    {
      name: "Premium Corporate Package",
      tagline: "For companies that need a full digital system",
      timeline: "4–6 months",
      price: "GHS 45,000",
      badge: "",
      highlights: [
        "Custom UI/UX design",
        "Full CMS or web application",
        "Employee portal / client portal",
        "API integrations",
        "Mobile app–feel interface",
        "Enterprise SEO",
        "Security firewall + monitoring",
        "Priority support",
        "Brand kit creation",
        "Hosting not included",
      ],
    },
  ],
  appPackages: [
    {
      name: "Starter App Package",
      tagline: "Best for small businesses & personal brands",
      timeline: "2–3 weeks",
      price: "GHS 12,000",
      badge: "",
      highlights: [
        "Cross-platform app (Android + iOS ready)",
        "5 main screens (Home, About/Services, Contact)",
        "Basic UI/UX design",
        "Simple dashboard",
        "1 API integration (WhatsApp, Contact form, Payment link)",
        "Push notifications (basic)",
        "1-month free support",
      ],
    },
    {
      name: "Business Growth Package",
      tagline: "Best for SMEs, e-commerce, service companies",
      timeline: "4–6 weeks",
      price: "GHS 24,000",
      badge: "Most popular",
      highlights: [
        "Fully functional Android & iOS app",
        "8–12 screens (custom UI/UX)",
        "User authentication (Email/Phone login)",
        "Payment gateway integration",
        "Booking system / E-commerce store",
        "Analytics integration (Firebase)",
        "Admin panel for app management",
        "Push notifications",
        "2 months support",
        "SEO-Optimized app listing (Play Store & App Store)",
      ],
    },
    {
      name: "Enterprise App Package",
      tagline: "Best for large companies, marketplaces, delivery apps, finance apps",
      timeline: "2–3 months",
      price: "GHS 80,000",
      badge: "",
      highlights: [
        "Native-like performance (Android & iOS)",
        "Up to 25 screens (custom UI/UX)",
        "Advanced authentication (OTP, 2FA, Social Login)",
        "Full e-commerce or marketplace integration",
        "Wallet system / subscription system",
        "Real-time chat",
        "Advanced admin dashboard + analytics",
        "Role-based access for company staff",
        "API development + third-party integrations",
        "Full branding & Play Store/App Store optimization",
        "3 months support + maintenance",
      ],
    },
    {
      name: "Advanced Marketplace & Fintech Package",
      tagline: "For marketplace / fintech apps (Uber-like, Bolt-like, wallets, loans)",
      timeline: "3–6 months",
      price: "GHS 120,000",
      badge: "",
      highlights: [
        "Android & iOS apps + Web Admin + Vendor Portal",
        "Real-time location tracking",
        "In-app wallet + payment orchestration",
        "Chat & notifications",
        "Multi-vendor system",
        "Advanced security (bank-grade encryption)",
        "API gateway + cloud infrastructure setup",
        "6 months premium support",
      ],
    },
  ],
  seoGrowthPlan: {
    name: "Professional SEO Growth Plan",
    priceRange: "GHS 600/month – GHS 2,000/month",
    items: [
      "Keyword ranking",
      "Backlinks",
      "Blog content",
      "Technical SEO",
      "Monthly reports",
    ],
  },
};

export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne({});
    
    if (!settings) {
      const defaultSettings = {
        contactEmail: "info@skytech.example",
        contactPhone: "+233 000 000 000",
        whatsapp: "+233000000000",
        address: "",
        pricingBookletUrl: "",
        pricing: SEEDED_PRICING,
        affiliateNetwork: {
          ...SEEDED_AFFILIATE_NETWORK,
        },
        awards: SEEDED_AWARDS,
      };
      settings = await Settings.create(defaultSettings);
    }

    // If older settings exist without affiliates/awards/pricing, seed once (non-destructive)
    const hasMultinational = Boolean(settings?.affiliateNetwork?.multinational?.length);
    const hasLocal = Boolean(settings?.affiliateNetwork?.local?.length);
    const hasAwards = Boolean(settings?.awards?.length);
    const hasPricing = Boolean(
      settings?.pricing?.websitePackages?.length ||
        settings?.pricing?.appPackages?.length ||
        settings?.pricing?.seoGrowthPlan?.name,
    );

    if (!hasMultinational || !hasLocal || !hasAwards || !hasPricing) {
      const patch: any = {};
      if (!hasMultinational || !hasLocal) {
        patch.affiliateNetwork = {
          multinational: hasMultinational
            ? settings.affiliateNetwork.multinational
            : SEEDED_AFFILIATE_NETWORK.multinational,
          local: hasLocal ? settings.affiliateNetwork.local : SEEDED_AFFILIATE_NETWORK.local,
        };
      }
      if (!hasAwards) patch.awards = SEEDED_AWARDS;
      if (!hasPricing) patch.pricing = SEEDED_PRICING;

      if (Object.keys(patch).length) {
        settings = await Settings.findByIdAndUpdate(settings._id, patch, {
          new: true,
        });
      }
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/content/settings error:", error);
    return NextResponse.json(
      { error: "Failed to read settings data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    let settings = await Settings.findOne({});
    if (settings) {
      await Settings.findByIdAndUpdate(settings._id, body);
    } else {
      await Settings.create(body);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/content/settings error:", error);
    return NextResponse.json(
      { error: "Failed to save settings data" },
      { status: 500 },
    );
  }
}

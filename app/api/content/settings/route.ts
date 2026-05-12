import { NextResponse } from "next/server";
import fs from "fs";
import { resolveSharedData } from "../../../lib/sharedData";

const SEEDED_SETTINGS = {
  siteName: "Skytech Ghana",
  siteDescription: "We build websites and mobile apps for businesses.",
  contactEmail: "hello@skytech.com",
  contactPhone: "+233 50 000 0000",
  whatsapp: "+233 50 000 0000",
  address: "Accra, Ghana",
  pricingBookletUrl: "",
  pricing: {
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
          "1 business email",
          "Google Maps integration",
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
          "Advanced SEO",
          "Custom contact forms",
          "Live chat system",
          "Testimonials & Portfolio",
          "Blog with admin access",
          "Analytics dashboard",
          "3 business emails",
          "Security hardening",
          "Google Business Profile optimization",
        ],
      },
      {
        name: "E-commerce/Booking Package",
        tagline: "For Retail & Service Businesses",
        timeline: "3–6 months",
        price: "GHS 25,000",
        badge: "",
        highlights: [
          "Full online store or booking system",
          "Product uploads",
          "Payment integrations",
          "Stock management",
          "Coupon system",
          "Cart abandonment recovery",
          "Automated order emails",
          "Secure dashboard",
          "Advanced SEO",
          "5 business emails",
        ],
      },
    ],
    appPackages: [
      {
        name: "Starter App Package",
        tagline: "Best for small businesses",
        timeline: "2–3 weeks",
        price: "GHS 12,000",
        badge: "",
        highlights: [
          "Android + iOS ready",
          "5 main screens",
          "Basic UI/UX design",
          "Simple dashboard",
          "Push notifications",
        ],
      },
      {
        name: "Business Growth Package",
        tagline: "Best for SMEs",
        timeline: "4–6 weeks",
        price: "GHS 24,000",
        badge: "Most popular",
        highlights: [
          "Android & iOS app",
          "8–12 screens",
          "User authentication",
          "Payment gateway",
          "Admin panel",
          "Analytics integration",
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
  },
  affiliateNetwork: {
    multinational: [
      { name: "Tullow Ghana Limited", logoUrl: "" },
      { name: "Newmont Ghana Limited", logoUrl: "" },
      { name: "Guinness Ghana Limited", logoUrl: "" },
    ],
    local: [
      { name: "Ecobank", logoUrl: "" },
      { name: "Stanbic Bank", logoUrl: "" },
      { name: "Oxfam Ghana", logoUrl: "" },
    ],
  },
  awards: [
    { title: "Industry excellence", subtitle: "Recognized for outstanding service." },
    { title: "Regional distinction", subtitle: "Trusted for quality and reliability." },
  ],
};

export async function GET() {
  try {
    const filePath = resolveSharedData("settings.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(SEEDED_SETTINGS);
    }
    
    const data = fs.readFileSync(filePath, "utf8");
    const settings = JSON.parse(data);
    
    // Merge with seeded data to ensure all fields exist
    return NextResponse.json({
      ...SEEDED_SETTINGS,
      ...settings,
    });
  } catch (error) {
    console.error("GET /api/content/settings error:", error);
    return NextResponse.json(SEEDED_SETTINGS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = resolveSharedData("settings.json");
    
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/content/settings error:", error);
    return NextResponse.json(
      { error: "Failed to save settings data" },
      { status: 500 },
    );
  }
}

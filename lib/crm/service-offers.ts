import { WEBSITE_OFFERS } from "@/lib/crm/website-offers";

export type ServiceKey = "website" | "app" | "seo" | "tour" | "crm";

export interface OfferLine {
  description: string;
  unitPrice?: number;
}

export interface DisplayOffer {
  id: string;
  name: string;
  total: number | null;
  period?: string;
  renewal?: number;
  featured?: boolean;
  eyebrow: string;
  items: OfferLine[];
}

export interface ServiceMenu {
  id: ServiceKey;
  label: string;
  note: string;
  offers: DisplayOffer[];
}

const lines = (parts: string[]): OfferLine[] => parts.map((description) => ({ description }));

export const SERVICE_MENUS: ServiceMenu[] = [
  {
    id: "website",
    label: "Website",
    note: "Software, hosting, domain, search, and maintenance. The lines here are the lines on the invoice.",
    offers: WEBSITE_OFFERS.map((offer) => ({
      id: offer.id,
      name: offer.name,
      total: offer.total,
      featured: offer.id === "standard",
      eyebrow: offer.id === "standard" ? "Most businesses start here" : "Website",
      items: offer.items,
    })),
  },
  {
    id: "app",
    label: "Mobile app",
    note: "Android and iOS, with the admin side included. These totals are the rate card.",
    offers: [
      {
        id: "growth",
        name: "Business growth app",
        total: 24000,
        renewal: 4000,
        eyebrow: "Mobile app",
        items: lines([
          "Android and iOS, 8–12 screens",
          "A payment step",
          "Push notifications",
          "An admin panel",
          "Store listing",
        ]),
      },
      {
        id: "suite",
        name: "Enterprise app",
        total: 80000,
        renewal: 12000,
        featured: true,
        eyebrow: "Most teams start here",
        items: lines([
          "Up to 25 screens",
          "Live data between the app and the desk",
          "Room to grow the hosting",
          "Sign-in with a second check",
          "Six months of care after launch",
        ]),
      },
      {
        id: "marketplace",
        name: "Marketplace app",
        total: 120000,
        renewal: 20000,
        eyebrow: "Mobile app",
        items: lines([
          "More than one seller",
          "A wallet inside the app",
          "Live tracking where the work moves",
          "A portal for the sellers",
          "A support line after launch",
        ]),
      },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    note: "Search work billed each month, after the site is live.",
    offers: [
      {
        id: "silver",
        name: "Silver",
        total: 1500,
        period: "/ month",
        renewal: 400,
        eyebrow: "SEO",
        items: lines([
          "Keyword research",
          "On-page search work",
          "A report each month",
          "Local search",
        ]),
      },
      {
        id: "gold",
        name: "Gold",
        total: 3500,
        period: "/ month",
        renewal: 800,
        featured: true,
        eyebrow: "Most sites start here",
        items: lines([
          "A look at who already ranks",
          "Links from other sites",
          "A plan for what to publish",
          "A review every two weeks",
        ]),
      },
      {
        id: "platinum",
        name: "Platinum",
        total: 7500,
        period: "/ month",
        renewal: 1800,
        eyebrow: "SEO",
        items: lines([
          "The wider presence, not only the site",
          "Four posts a month",
          "A technical search audit",
          "A call each week",
        ]),
      },
    ],
  },
  {
    id: "tour",
    label: "Virtual tour",
    note: "For hospitality, hotels, apartments, Airbnb, event centres, and real estate. One space starts at GH₵8,799. A larger property is priced with the brief.",
    offers: [
      {
        id: "space",
        name: "One space",
        total: 8799,
        eyebrow: "Starts here",
        items: lines(["One room or suite", "A walkable tour", "Embedded on the website"]),
      },
      {
        id: "property",
        name: "A property",
        total: null,
        featured: true,
        eyebrow: "Virtual tour",
        items: lines([
          "Several rooms or areas",
          "A path through the property",
          "Embedded on the website",
          "Hosting for the year",
        ]),
      },
      {
        id: "collection",
        name: "A collection",
        total: null,
        eyebrow: "Virtual tour",
        items: lines([
          "Tours across more than one property",
          "A page that lists them",
          "Care after the first launch",
        ]),
      },
    ],
  },
  {
    id: "crm",
    label: "CRM",
    note: "Customer management software. GH₵200 each month, or GH₵2,400 for the year.",
    offers: [
      {
        id: "list",
        name: "A client list",
        total: 200,
        period: "/ month",
        renewal: 200,
        eyebrow: "CRM",
        items: lines(["Contacts in one place", "The enquiry that started the job", "GH₵2,400 / year"]),
      },
      {
        id: "follow",
        name: "Follow-ups",
        total: 200,
        period: "/ month",
        renewal: 200,
        featured: true,
        eyebrow: "Most desks start here",
        items: lines([
          "A path for the next step",
          "A reminder after the first call",
          "GH₵2,400 / year",
        ]),
      },
      {
        id: "desk",
        name: "A larger desk",
        total: 200,
        period: "/ month",
        renewal: 200,
        eyebrow: "CRM",
        items: lines(["More than one person on the list", "Roles for the team", "GH₵2,400 / year"]),
      },
    ],
  },
];

export function serviceMenu(id: string | undefined | null) {
  return SERVICE_MENUS.find((menu) => menu.id === id) ?? SERVICE_MENUS[0];
}

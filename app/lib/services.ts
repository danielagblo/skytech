import { isMysql } from "./db";
import * as mysql from "./mysql";

export type ServiceMedia = "mark" | "image" | "video";

export interface FilmServiceItem {
  id: string;
  kicker: string;
  line: string;
  body: string;
  price: string;
  note: string;
  href: string;
  media: ServiceMedia;
  image?: string;
  imageAlt?: string;
  videoSrc?: string;
}

export interface FilmServiceStep {
  id: string;
  label: string;
  title: string;
  body: string;
}

export interface FilmServicesContent {
  services: FilmServiceItem[];
  steps: FilmServiceStep[];
}

export const DEFAULT_FILM_SERVICES: FilmServicesContent = {
  services: [
    {
      id: "website",
      kicker: "Website",
      line: "They land on the page. They should be able to ask, book, or pay.",
      body: "The site is written around that step. Hosting, the domain, search on the page, and someone who still answers are in the same offer, from Skytech Ghana in Accra.",
      price: "For only GH₵8,399",
      note: "A simpler site starts at GH₵3,500. A shop or booking site starts at GH₵14,755.",
      href: "/pricing?service=website",
      media: "mark",
    },
    {
      id: "app",
      kicker: "Mobile app",
      line: "The customer finishes the job on their phone.",
      body: "Use an app when the next step is a payment, a booking, or a status they check again. Android and iOS, and your desk sees the same job.",
      price: "Starts at GH₵24,000",
      note: "8 to 12 screens, the admin side, and the store listing. A larger build is on the rate card.",
      href: "/pricing?service=app",
      media: "image",
      image: "/images/images/onlineEcommerceImage.png",
      imageAlt: "A customer completing an order",
    },
    {
      id: "seo",
      kicker: "SEO",
      line: "They search. Your business should be the one they find.",
      body: "A new site does not show up because it launched. Each month we work the words customers type, the pages that should answer, and your listing in Accra.",
      price: "From GH₵1,500 a month",
      note: "Most sites take the plan at GH₵3,500 a month, with a review every two weeks.",
      href: "/pricing?service=seo",
      media: "image",
      image: "/images/images/globeImage.png",
      imageAlt: "Search bringing a business up when a customer looks",
    },
    {
      id: "tour",
      kicker: "Virtual tour",
      line: "Walk the room before you book.",
      body: "A guest, a buyer, or an organiser moves through the space before they arrive. Built for hospitality and property.",
      price: "For only GH₵8,799",
      note: "Hospitality · Hotels · Apartments · Airbnb · Event centres · Real estate",
      href: "/pricing?service=tour",
      media: "video",
      videoSrc: "/videos/virtual-tour.mp4",
    },
    {
      id: "crm",
      kicker: "Customer management software",
      line: "Keep every customer in one place.",
      body: "When someone calls or writes in, their name stays here with what they asked for and whether they have paid. You always know who needs a follow-up next.",
      price: "GH₵200 a month",
      note: "Or GH₵2,400 for the year.",
      href: "/pricing?service=crm",
      media: "image",
      image: "/images/crm-board-crop.jpg",
      imageAlt: "Customer list showing names, requests, and payment status",
    },
  ],
  steps: [
    {
      id: "brief",
      label: "01",
      title: "The brief",
      body: "What the business sells, and the step a customer should take.",
    },
    {
      id: "build",
      label: "02",
      title: "The build",
      body: "Design, pages, and the offer, made in Accra.",
    },
    {
      id: "after",
      label: "03",
      title: "The year after",
      body: "Hosting, domain, search, and a person who still answers.",
    },
  ],
};

function normalizeContent(raw: Partial<FilmServicesContent> | null | undefined): FilmServicesContent {
  const services =
    Array.isArray(raw?.services) && raw!.services!.length > 0
      ? raw!.services!.map((item, index) => ({
          id: item.id || `service-${index + 1}`,
          kicker: item.kicker || "",
          line: item.line || "",
          body: item.body || "",
          price: item.price || "",
          note: item.note || "",
          href: item.href || "/pricing",
          media: (item.media === "image" || item.media === "video" || item.media === "mark"
            ? item.media
            : "mark") as ServiceMedia,
          image: item.image || "",
          imageAlt: item.imageAlt || "",
          videoSrc: item.videoSrc || "/videos/virtual-tour.mp4",
        }))
      : DEFAULT_FILM_SERVICES.services;

  const steps =
    Array.isArray(raw?.steps) && raw!.steps!.length > 0
      ? raw!.steps!.map((item, index) => ({
          id: item.id || `step-${index + 1}`,
          label: item.label || String(index + 1).padStart(2, "0"),
          title: item.title || "",
          body: item.body || "",
        }))
      : DEFAULT_FILM_SERVICES.steps;

  return { services, steps };
}

async function getServicesMysql(): Promise<FilmServicesContent> {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT payload FROM film_services WHERE page_key = ? LIMIT 1",
    ["services"],
  );
  if (!rows.length) return DEFAULT_FILM_SERVICES;
  return normalizeContent(mysql.parseJson(rows[0].payload) as FilmServicesContent);
}

async function saveServicesMysql(content: FilmServicesContent): Promise<void> {
  await mysql.initSchema();
  const payload = JSON.stringify(normalizeContent(content));
  const existing = await mysql.query(
    "SELECT id FROM film_services WHERE page_key = ? LIMIT 1",
    ["services"],
  );
  if (existing.length > 0) {
    await mysql.update("film_services", existing[0].id, {
      payload,
      updated_at: new Date(),
    });
    return;
  }
  await mysql.insert("film_services", {
    page_key: "services",
    payload,
    updated_at: new Date(),
  });
}

export async function getFilmServices(): Promise<FilmServicesContent> {
  if (isMysql()) {
    try {
      return await getServicesMysql();
    } catch (error) {
      console.error("Failed to fetch film services:", error);
      return DEFAULT_FILM_SERVICES;
    }
  }
  return DEFAULT_FILM_SERVICES;
}

export async function saveFilmServices(content: FilmServicesContent): Promise<void> {
  if (isMysql()) {
    await saveServicesMysql(content);
    return;
  }
  console.warn("Film services save skipped: MySQL is not configured.");
}

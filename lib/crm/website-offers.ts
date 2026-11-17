export interface WebsiteOfferItem {
  description: string;
  unitPrice: number;
}

export interface WebsiteOffer {
  id: "basic" | "standard" | "ecommerce";
  name: string;
  total: number;
  items: WebsiteOfferItem[];
}

const offer = (
  id: WebsiteOffer["id"],
  name: string,
  parts: Array<[string, number]>,
): WebsiteOffer => ({
  id,
  name,
  total: parts.reduce((sum, [, amount]) => sum + amount, 0),
  items: parts.map(([description, unitPrice]) => ({ description, unitPrice })),
});

export const WEBSITE_OFFERS: WebsiteOffer[] = [
  offer("basic", "Basic offer", [
    ["Software", 2000],
    ["Hosting", 750],
    ["Domain", 300],
    ["SEO/Blog", 300],
    ["Maintenance", 150],
  ]),
  offer("standard", "Standard offer", [
    ["Software", 4000],
    ["Hosting", 2300],
    ["Domain", 300],
    ["SEO/Blog", 1499],
    ["Maintenance", 300],
  ]),
  offer("ecommerce", "Ecommerce/booking offer", [
    ["Software", 8000],
    ["Hosting", 3000],
    ["Domain", 300],
    ["SEO/Blog", 2455],
    ["Maintenance", 1000],
  ]),
];

export function websiteOfferById(id: string) {
  return WEBSITE_OFFERS.find((offer) => offer.id === id) ?? null;
}

export function detectWebsiteOffer(
  items: Array<{ description?: string; unitPrice?: number; quantity?: number }>,
) {
  return (
    WEBSITE_OFFERS.find((offer) => {
      if (items.length !== offer.items.length) return false;
      return offer.items.every((line, index) => {
        const item = items[index];
        return (
          item?.description === line.description &&
          Number(item.unitPrice) === line.unitPrice &&
          Number(item.quantity ?? 1) === 1
        );
      });
    }) ?? null
  );
}

export function websiteOfferFromText(value: string) {
  const text = value.toLowerCase();
  if (
    text.includes("ecommerce") ||
    text.includes("e-commerce") ||
    text.includes("booking")
  ) {
    return websiteOfferById("ecommerce");
  }
  if (text.includes("standard")) return websiteOfferById("standard");
  if (text.includes("basic")) return websiteOfferById("basic");
  return null;
}

export function websiteOfferFromValue(value: number) {
  const amount = Number(value);
  if (amount === 3520 || amount === 3500) return websiteOfferById("basic");
  if (amount === 8399) return websiteOfferById("standard");
  if (amount === 14755) return websiteOfferById("ecommerce");
  return null;
}

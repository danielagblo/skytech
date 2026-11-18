import type { PricingCategory, PricingPackage } from "@/app/lib/pricing";
import {
  SERVICE_MENUS,
  type DisplayOffer,
  type ServiceKey,
  type ServiceMenu,
} from "@/lib/crm/service-offers";

const LEGACY_CATEGORY: Record<string, ServiceKey> = {
  web: "website",
  website: "website",
  mobile: "app",
  app: "app",
  marketing: "seo",
  seo: "seo",
  tour: "tour",
  crm: "crm",
};

const NOTES: Record<ServiceKey, string> = Object.fromEntries(
  SERVICE_MENUS.map((menu) => [menu.id, menu.note]),
) as Record<ServiceKey, string>;

function parseMoney(value?: string | null): number | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  if (!trimmed || /ask|brief|custom|quote/i.test(trimmed)) return null;
  const amount = Number(trimmed.replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? amount : null;
}

function slugify(value: string, fallback: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || fallback;
}

function formatInterval(interval?: string | null) {
  if (!interval?.trim()) return undefined;
  const value = interval.trim();
  if (value.startsWith("/")) return value;
  if (/^mo(nth)?$/i.test(value)) return "/ month";
  if (/^year(ly)?$/i.test(value)) return "/ year";
  return `/ ${value}`;
}

export function serviceMenusToPricingCategories(menus: ServiceMenu[] = SERVICE_MENUS): PricingCategory[] {
  return menus.map((menu) => ({
    category: menu.id,
    label: menu.label,
    packages: menu.offers.map(
      (offer): PricingPackage => ({
        id: offer.id,
        name: offer.name,
        tier: offer.eyebrow || menu.label,
        price: offer.total == null ? "" : String(offer.total),
        usd: "",
        renewal: offer.renewal == null ? "" : String(offer.renewal),
        interval: offer.period?.replace(/^\s*\/\s*/, "") || "",
        featured: Boolean(offer.featured),
        highlights: offer.items.map((item) =>
          item.unitPrice != null ? `${item.description} · GH₵${item.unitPrice}` : item.description,
        ),
      }),
    ),
  }));
}

export function normalizePricingCategories(categories: PricingCategory[]): PricingCategory[] {
  const defaults = serviceMenusToPricingCategories();
  const byId = new Map<string, PricingCategory>();

  for (const category of categories) {
    const mapped = LEGACY_CATEGORY[category.category];
    const id = mapped || category.category;
    if (!SERVICE_MENUS.some((menu) => menu.id === id) && !mapped) {
      byId.set(category.category, category);
      continue;
    }
    const existing = byId.get(id);
    const packages = category.packages || [];
    if (!existing || packages.length >= (existing.packages?.length || 0)) {
      byId.set(id, {
        ...category,
        category: id,
        label: category.label || defaults.find((item) => item.category === id)?.label || id,
      });
    }
  }

  const extras = Array.from(byId.values()).filter(
    (category) => !SERVICE_MENUS.some((menu) => menu.id === category.category),
  );
  return [...defaults.map((fallback) => byId.get(fallback.category) || fallback), ...extras];
}

function packageToOffer(
  pkg: PricingPackage,
  index: number,
  menuLabel: string,
  menuId: ServiceKey,
): DisplayOffer {
  const fallback = SERVICE_MENUS.find((menu) => menu.id === menuId)?.offers[index];
  return {
    id: pkg.id || fallback?.id || slugify(pkg.name || pkg.tier || `offer-${index}`, `offer-${index}`),
    name: pkg.name || fallback?.name || `Offer ${index + 1}`,
    total: parseMoney(pkg.price),
    period: formatInterval(pkg.interval),
    renewal: parseMoney(pkg.renewal) ?? undefined,
    featured: Boolean(pkg.featured),
    eyebrow: pkg.tier || menuLabel,
    items: (pkg.highlights || [])
      .map((line) => String(line || "").trim())
      .filter(Boolean)
      .map((description) => ({ description })),
  };
}

export function pricingCategoriesToMenus(categories: PricingCategory[]): ServiceMenu[] {
  const normalized = normalizePricingCategories(categories);
  const known = new Map(
    normalized
      .filter((category) => SERVICE_MENUS.some((menu) => menu.id === category.category))
      .map((category) => [category.category as ServiceKey, category]),
  );

  return SERVICE_MENUS.map((menu) => {
    const category = known.get(menu.id);
    if (!category?.packages?.length) return menu;
    return {
      id: menu.id,
      label: category.label || menu.label,
      note: NOTES[menu.id] || menu.note,
      offers: category.packages.map((pkg, index) =>
        packageToOffer(pkg, index, category.label || menu.label, menu.id),
      ),
    };
  });
}

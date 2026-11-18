import { getPricing } from "@/app/lib/pricing";
import { pricingCategoriesToMenus } from "@/app/lib/pricing-map";
import type { ServiceMenu } from "@/lib/crm/service-offers";

export { pricingCategoriesToMenus, normalizePricingCategories, serviceMenusToPricingCategories } from "@/app/lib/pricing-map";

export async function getServiceMenus(): Promise<ServiceMenu[]> {
  const pricing = await getPricing();
  return pricingCategoriesToMenus(pricing);
}

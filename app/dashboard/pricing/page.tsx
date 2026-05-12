import { getPricing } from "../../lib/pricing";
import PricingManager from "./PricingManager";

export const dynamic = "force-dynamic";

export default async function DashboardPricingPage() {
  const pricingData = await getPricing();
  
  // Transform to plain object for client
  const serializablePricing = JSON.parse(JSON.stringify(pricingData));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Pricing Manager</h1>
        <p className="text-slate-500 mt-2">Manage your global rate card, tiered packages, and dual-currency (GHS/USD) transparency.</p>
      </div>
      
      <PricingManager initialPricing={serializablePricing} />
    </div>
  );
}

import { getPricing } from "../../lib/pricing";
import PricingManager from "./PricingManager";

export const dynamic = "force-dynamic";

export default async function DashboardPricingPage() {
  const pricingData = await getPricing();
  const serializablePricing = JSON.parse(JSON.stringify(pricingData));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Pricing</h1>
        <p className="mt-2 text-slate-500">
          These packages appear on the homepage and /pricing. Leave price blank for “priced with the brief.”
        </p>
      </div>

      <PricingManager initialPricing={serializablePricing} />
    </div>
  );
}

import React from "react";
import { getPricing } from "../../lib/pricing";
import PricingClient from "./PricingClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Pricing | Skytech Ghana",
  description: "Transparent, ROI-centric pricing for web engineering, mobile apps, and digital growth.",
};

export default async function PricingPage() {
  const pricing = await getPricing();
  
  // Transform to plain objects for the client
  const serializablePricing = JSON.parse(JSON.stringify(pricing));

  return <PricingClient initialPricing={serializablePricing} />;
}

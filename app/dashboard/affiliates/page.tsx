import React from "react";
import AffiliateManager from "./AffiliateManager";
import { getAffiliates } from "../../lib/affiliates";

export const dynamic = 'force-dynamic';


export default async function AffiliateDashboardPage() {
  const affiliates = await getAffiliates();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Affiliate Network</h1>
        <p className="text-slate-500">Manage partner logos, size, visibility, and grid layout. Changes appear on the homepage after saving.</p>
      </div>

      <AffiliateManager initialAffiliates={affiliates} />
    </div>
  );
}

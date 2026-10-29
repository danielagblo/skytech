import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema } from "@/lib/crm/db";
import type { LeadStats } from "@/types/lead.types";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rows = await crmQuery<{ status: string; count: number }>(
      "SELECT status, COUNT(*) as count FROM leads WHERE deleted_at IS NULL GROUP BY status"
    );

    const sourceRows = await crmQuery<{ lead_source: string; count: number }>(
      "SELECT lead_source, COUNT(*) as count FROM leads WHERE deleted_at IS NULL AND lead_source IS NOT NULL GROUP BY lead_source"
    );

    const scoreRows = await crmQuery<{ avgScore: number }>(
      "SELECT AVG(conversion_score) as avgScore FROM leads WHERE deleted_at IS NULL"
    );

    const countsByStatus: Record<string, number> = {
      NEW: 0,
      CONTACTED: 0,
      QUALIFIED: 0,
      LOST: 0,
      CONVERTED: 0,
    };

    let total = 0;
    rows.forEach((r) => {
      const s = (r.status || "").toUpperCase();
      const count = Number(r.count || 0);
      total += count;
      if (s in countsByStatus) {
        countsByStatus[s] = count;
      }
    });

    const sourceBreakdown: Record<string, number> = {
      SMS: 0,
      EMAIL: 0,
      FACEBOOK: 0,
      GOOGLE: 0,
      BANNER: 0,
      META_ADS: 0,
    };

    sourceRows.forEach((r) => {
      const src = (r.lead_source || "").toUpperCase();
      const count = Number(r.count || 0);
      sourceBreakdown[src] = count;
    });

    const stats: LeadStats = {
      total,
      countsByStatus,
      sourceBreakdown,
      averageConversionScore: Math.round(Number(scoreRows[0]?.avgScore || 0)),
    };

    return apiSuccess(stats);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch stats", 500);
  }
}

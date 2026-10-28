import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatDeal } from "@/lib/crm/formatters";
import { Deal } from "@/types/deal.types";
import { DealStage } from "@/types/api.types";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>(
      "SELECT * FROM deals WHERE deleted_at IS NULL ORDER BY created_at DESC"
    );

    const pipeline: Record<DealStage, Deal[]> = {
      PROSPECTING: [],
      NEGOTIATION: [],
      SETTLEMENT: [],
      PAYMENT: [],
      CLIENT_RETENTION: [],
    };

    rows.forEach((r) => {
      const deal = formatDeal(r);
      const stage = (r.stage || "PROSPECTING") as DealStage;
      if (pipeline[stage]) {
        pipeline[stage].push(deal);
      } else {
        pipeline.PROSPECTING.push(deal);
      }
    });

    return apiSuccess(pipeline, "Pipeline loaded");
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch pipeline", 500);
  }
}

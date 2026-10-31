import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import type { ContactSegments } from "@/types/broadcast.types";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();

    // Total active leads
    const leadCountRows = await crmQuery<MysqlRow>(
      "SELECT COUNT(*) as cnt FROM leads WHERE deleted_at IS NULL"
    );
    const totalLeads = Number(leadCountRows[0]?.cnt || 0);

    // Deals grouped by stage
    const dealRows = await crmQuery<MysqlRow>(
      "SELECT stage, COUNT(*) as cnt FROM deals WHERE deleted_at IS NULL GROUP BY stage"
    );

    const byStage: Record<string, number> = {
      NEGOTIATION: 0,
      SETTLEMENT: 0,
      PAYMENT: 0,
    };

    dealRows.forEach((r) => {
      const stage = String(r.stage || "").toUpperCase();
      const count = Number(r.cnt || 0);
      byStage[stage] = count;
    });

    const segments: ContactSegments = {
      all: totalLeads,
      byStage,
    };

    return apiSuccess(segments);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

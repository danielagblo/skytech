import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema } from "@/lib/crm/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rows = await crmQuery<{ status: string; count: number }>(
      "SELECT status, COUNT(*) as count FROM leads WHERE deleted_at IS NULL GROUP BY status"
    );

    const stats: Record<string, number> = {
      total: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      lost: 0,
      converted: 0,
    };

    rows.forEach((r) => {
      const s = (r.status || "").toLowerCase();
      const count = Number(r.count || 0);
      stats.total += count;
      if (s === "new") stats.new = count;
      else if (s === "contacted") stats.contacted = count;
      else if (s === "qualified") stats.qualified = count;
      else if (s === "lost") stats.lost = count;
      else if (s === "converted") stats.converted = count;
    });

    return apiSuccess(stats);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch stats", 500);
  }
}

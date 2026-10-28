import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema } from "@/lib/crm/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rows = await crmQuery<{ status: string; count: number }>(
      "SELECT status, COUNT(*) as count FROM tasks GROUP BY status"
    );

    const stats = {
      todo: 0,
      doing: 0,
      done: 0,
      overdue: 0,
      total: 0,
    };

    rows.forEach((r) => {
      const s = (r.status || "").toLowerCase();
      const count = Number(r.count || 0);
      stats.total += count;
      if (s === "todo") stats.todo = count;
      else if (s === "doing") stats.doing = count;
      else if (s === "done") stats.done = count;
      else if (s === "overdue") stats.overdue = count;
    });

    return apiSuccess(stats);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

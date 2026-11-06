import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import type { FollowUpAlert, FollowUpUrgency } from "@/types/notification.types";

const SIX_HOURS = 6 * 60 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

function urgencyFor(followUpAt: Date): FollowUpUrgency | null {
  const remaining = followUpAt.getTime() - Date.now();
  if (remaining <= 0) return "DUE";
  if (remaining <= SIX_HOURS) return "SIX_HOURS";
  if (remaining <= ONE_DAY) return "ONE_DAY";
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const params: string[] = [];
    let assignedSql = "";
    if (user.role !== "ADMIN") {
      assignedSql =
        "AND (d.assigned_to = ? OR JSON_CONTAINS(d.assignee_ids, JSON_QUOTE(?)))";
      params.push(user.id, user.id);
    }

    const rows = await crmQuery<MysqlRow>(
      `SELECT d.id AS deal_id, d.title AS deal_title, f.follow_up_at
       FROM (
         SELECT deal_id, MAX(ts) AS follow_up_at
         FROM (
           SELECT deal_id, follow_up_at AS ts
           FROM deal_logs
           WHERE follow_up_at IS NOT NULL
           UNION ALL
           SELECT deal_id, settlement_follow_up AS ts
           FROM deal_logs
           WHERE settlement_follow_up IS NOT NULL
         ) times
         GROUP BY deal_id
       ) f
       JOIN deals d ON d.id = f.deal_id AND d.deleted_at IS NULL
       WHERE f.follow_up_at <= DATE_ADD(NOW(), INTERVAL 26 HOUR)
       ${assignedSql}
       ORDER BY f.follow_up_at ASC
       LIMIT 12`,
      params,
    );

    const alerts: FollowUpAlert[] = [];
    for (const row of rows) {
      const followUpAt = new Date(row.follow_up_at);
      if (Number.isNaN(followUpAt.getTime())) continue;
      alerts.push({
        dealId: String(row.deal_id),
        dealTitle: String(row.deal_title || "Deal"),
        followUpAt: followUpAt.toISOString(),
        urgency: urgencyFor(followUpAt) ?? "ONE_DAY",
      });
    }

    return apiSuccess(alerts);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

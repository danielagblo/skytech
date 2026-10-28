import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { userId } = await params;
    await initCrmSchema();

    const userRows = await crmQuery<MysqlRow>(
      "SELECT first_name, last_name FROM users WHERE id = ? LIMIT 1",
      [userId]
    );
    const name = userRows.length ? `${userRows[0].first_name} ${userRows[0].last_name}`.trim() : "Agent";

    const dealRows = await crmQuery<MysqlRow>(
      `SELECT COUNT(*) as count, COALESCE(SUM(total_paid), 0) as revenue
       FROM deals WHERE assigned_to = ? AND deleted_at IS NULL`,
      [userId]
    );

    const taskRows = await crmQuery<MysqlRow>(
      `SELECT COUNT(*) as count FROM tasks t
       JOIN task_assignees ta ON ta.task_id = t.id
       WHERE ta.user_id = ? AND t.status = 'DONE'`,
      [userId]
    );

    return apiSuccess({
      userId,
      name,
      deals: Number(dealRows[0]?.count || 0),
      revenue: Number(dealRows[0]?.revenue || 0),
      tasksDone: Number(taskRows[0]?.count || 0),
    });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

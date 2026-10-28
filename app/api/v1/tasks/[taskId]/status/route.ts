import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatTask } from "@/lib/crm/formatters";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { taskId } = await params;
    const body = await request.json();
    const status = body.status;
    if (!status) return apiError("Status is required", 400);

    await initCrmSchema();
    await crmExecute(
      "UPDATE tasks SET status = ?, completion_reason = COALESCE(?, completion_reason), updated_at = NOW() WHERE id = ?",
      [status, body.reason || null, taskId]
    );

    const updated = await crmQuery<MysqlRow>("SELECT * FROM tasks WHERE id = ?", [taskId]);
    if (!updated.length) return apiError("Task not found", 404);

    const assignees = await crmQuery<{ user_id: string }>(
      "SELECT user_id FROM task_assignees WHERE task_id = ?",
      [taskId]
    );

    return apiSuccess(formatTask(updated[0], assignees.map((a) => String(a.user_id))), "Status updated");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

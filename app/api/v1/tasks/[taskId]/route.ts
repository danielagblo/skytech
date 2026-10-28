import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatTask } from "@/lib/crm/formatters";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { taskId } = await params;
    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>("SELECT * FROM tasks WHERE id = ? LIMIT 1", [taskId]);
    if (!rows.length) return apiError("Task not found", 404);

    const assignees = await crmQuery<{ user_id: string }>(
      "SELECT user_id FROM task_assignees WHERE task_id = ?",
      [taskId]
    );

    return apiSuccess(formatTask(rows[0], assignees.map((a) => String(a.user_id))));
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { taskId } = await params;
    const body = await request.json();
    await initCrmSchema();

    await crmExecute(
      `UPDATE tasks SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        priority = COALESCE(?, priority),
        due_date = COALESCE(?, due_date),
        updated_at = NOW()
      WHERE id = ?`,
      [
        body.title ?? null,
        body.description ?? null,
        body.status ?? null,
        body.priority ?? null,
        body.dueDate ? new Date(body.dueDate) : null,
        taskId,
      ]
    );

    if (Array.isArray(body.assigneeIds)) {
      await crmExecute("DELETE FROM task_assignees WHERE task_id = ?", [taskId]);
      for (const uId of body.assigneeIds) {
        await crmExecute("INSERT INTO task_assignees (task_id, user_id) VALUES (?, ?)", [taskId, uId]);
      }
    }

    const updated = await crmQuery<MysqlRow>("SELECT * FROM tasks WHERE id = ?", [taskId]);
    const assignees = await crmQuery<{ user_id: string }>(
      "SELECT user_id FROM task_assignees WHERE task_id = ?",
      [taskId]
    );

    return apiSuccess(formatTask(updated[0], assignees.map((a) => String(a.user_id))), "Task updated");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { taskId } = await params;
    await initCrmSchema();
    await crmExecute("DELETE FROM task_assignees WHERE task_id = ?", [taskId]);
    await crmExecute("DELETE FROM tasks WHERE id = ?", [taskId]);
    return apiSuccess(null, "Task deleted");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

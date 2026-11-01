import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatSubTask } from "@/lib/crm/formatters";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string; subtaskId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { taskId, subtaskId } = await params;
    const body = await request.json();
    await initCrmSchema();

    await crmExecute(
      `UPDATE task_subtasks SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        priority = COALESCE(?, priority),
        complete = COALESCE(?, complete),
        updated_at = NOW()
      WHERE id = ? AND task_id = ?`,
      [
        body.title ?? null,
        body.description ?? null,
        body.priority ?? null,
        typeof body.complete === "boolean" ? body.complete : null,
        subtaskId,
        taskId,
      ]
    );

    const rows = await crmQuery<MysqlRow>(
      "SELECT * FROM task_subtasks WHERE id = ? AND task_id = ? LIMIT 1",
      [subtaskId, taskId]
    );
    if (!rows.length) return apiError("Subtask not found", 404);

    return apiSuccess(formatSubTask(rows[0]));
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string; subtaskId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { taskId, subtaskId } = await params;
    await initCrmSchema();

    await crmExecute("DELETE FROM task_subtasks WHERE id = ? AND task_id = ?", [
      subtaskId,
      taskId,
    ]);

    return apiSuccess({ success: true });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { formatSubTask } from "@/lib/crm/formatters";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { taskId } = await params;
    await initCrmSchema();

    const url = new URL(request.url);
    const page = Math.max(0, parseInt(url.searchParams.get("page") || "0", 10));
    const size = Math.max(1, Math.min(100, parseInt(url.searchParams.get("size") || "100", 10)));
    const offset = page * size;

    const countRows = await crmQuery<{ count: number }>(
      "SELECT COUNT(*) as count FROM task_subtasks WHERE task_id = ?",
      [taskId]
    );
    const totalElements = countRows[0]?.count || 0;
    const totalPages = Math.ceil(totalElements / size);

    const rows = await crmQuery<MysqlRow>(
      "SELECT * FROM task_subtasks WHERE task_id = ? ORDER BY created_at ASC LIMIT ? OFFSET ?",
      [taskId, size, offset]
    );

    const content = rows.map(formatSubTask);

    return apiSuccess({
      content,
      page,
      size,
      totalElements,
      totalPages,
      last: page >= totalPages - 1,
    });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { taskId } = await params;
    const body = await request.json();
    if (!body.title?.trim()) {
      return apiError("Subtask title is required", 400);
    }

    await initCrmSchema();
    const id = newId();

    await crmExecute(
      `INSERT INTO task_subtasks (id, company_id, task_id, title, description, priority, complete, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        id,
        user.companyId || null,
        taskId,
        body.title.trim(),
        body.description || null,
        body.priority || "LOW",
        Boolean(body.complete),
      ]
    );

    const rows = await crmQuery<MysqlRow>("SELECT * FROM task_subtasks WHERE id = ? LIMIT 1", [id]);
    return apiSuccess(formatSubTask(rows[0]), "Subtask created", 201);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

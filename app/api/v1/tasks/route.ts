import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { formatTask } from "@/lib/crm/formatters";

export { formatTask };

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const url = new URL(request.url);
    const page = Math.max(0, parseInt(url.searchParams.get("page") || "0", 10));
    const size = Math.max(1, Math.min(100, parseInt(url.searchParams.get("size") || "20", 10)));
    const search = url.searchParams.get("search")?.trim();
    const status = url.searchParams.get("status")?.trim();
    const priority = url.searchParams.get("priority")?.trim();

    let whereSql = "WHERE 1=1";
    const params: any[] = [];

    if (search) {
      whereSql += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status) {
      whereSql += " AND status = ?";
      params.push(status);
    }
    if (priority) {
      whereSql += " AND priority = ?";
      params.push(priority);
    }

    const countRows = await crmQuery<{ count: number }>(
      `SELECT COUNT(*) as count FROM tasks ${whereSql}`,
      params
    );
    const totalElements = countRows[0]?.count || 0;
    const totalPages = Math.ceil(totalElements / size);

    const offset = page * size;
    const rows = await crmQuery<MysqlRow>(
      `SELECT * FROM tasks ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, size, offset]
    );

    // Fetch assignees
    const taskIds = rows.map((r) => r.id);
    const assigneeMap: Record<string, string[]> = {};
    if (taskIds.length) {
      const placeholders = taskIds.map(() => "?").join(",");
      const assignees = await crmQuery<{ task_id: string; user_id: string }>(
        `SELECT task_id, user_id FROM task_assignees WHERE task_id IN (${placeholders})`,
        taskIds
      );
      assignees.forEach((a) => {
        if (!assigneeMap[a.task_id]) assigneeMap[a.task_id] = [];
        assigneeMap[a.task_id].push(String(a.user_id));
      });
    }

    const content = rows.map((r) => formatTask(r, assigneeMap[r.id] || []));

    return apiSuccess({
      content,
      page,
      size,
      totalElements,
      totalPages,
      last: page >= totalPages - 1,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch tasks", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const body = await request.json();
    const taskId = newId();

    await crmExecute(
      `INSERT INTO tasks (
        id, company_id, title, description, status, priority,
        created_by, allow_reminder, linked_lead_id, linked_deal_id, due_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        taskId,
        user.companyId || null,
        body.title || "Untitled Task",
        body.description || null,
        body.status || "TODO",
        body.priority || "MEDIUM",
        user.id,
        body.allowReminder !== false ? 1 : 0,
        body.linkedLeadId || null,
        body.linkedDealId || null,
        body.dueDate ? new Date(body.dueDate) : null,
      ]
    );

    const assigneeIds = Array.isArray(body.assigneeIds) ? body.assigneeIds : [];
    for (const uId of assigneeIds) {
      await crmExecute(
        "INSERT INTO task_assignees (task_id, user_id) VALUES (?, ?)",
        [taskId, uId]
      );
    }

    const created = await crmQuery<MysqlRow>("SELECT * FROM tasks WHERE id = ?", [taskId]);
    return apiSuccess(formatTask(created[0], assigneeIds), "Task created", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to create task", 500);
  }
}

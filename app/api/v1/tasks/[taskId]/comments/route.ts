import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { Comment } from "@/types/deal.types";

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
      "SELECT COUNT(*) as count FROM task_comments WHERE task_id = ?",
      [taskId]
    );
    const totalElements = countRows[0]?.count || 0;
    const totalPages = Math.ceil(totalElements / size);

    const rows = await crmQuery<MysqlRow>(
      `SELECT c.*, u.first_name, u.last_name, u.profile_photo_url
       FROM task_comments c
       LEFT JOIN users u ON u.id = c.author_id
       WHERE c.task_id = ?
       ORDER BY c.created_at ASC
       LIMIT ? OFFSET ?`,
      [taskId, size, offset]
    );

    const content: Comment[] = rows.map((r) => ({
      id: String(r.id),
      parentCommentId: r.parent_comment_id ? String(r.parent_comment_id) : null,
      authorId: String(r.author_id),
      authorName: `${r.first_name || ""} ${r.last_name || ""}`.trim() || "User",
      authorProfilePhotoUrl: r.profile_photo_url || null,
      body: r.body || "",
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));

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
    if (!body.body?.trim()) return apiError("Comment body is required", 400);

    await initCrmSchema();
    const commentId = newId();

    await crmExecute(
      `INSERT INTO task_comments (id, company_id, task_id, parent_comment_id, author_id, body, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [commentId, user.companyId || null, taskId, body.parentCommentId || null, user.id, body.body.trim()]
    );

    const created: Comment = {
      id: commentId,
      parentCommentId: body.parentCommentId || null,
      authorId: user.id,
      authorName: `${user.firstName} ${user.lastName}`.trim(),
      authorProfilePhotoUrl: user.profilePhotoUrl,
      body: body.body.trim(),
      createdAt: new Date().toISOString(),
    };

    return apiSuccess(created, "Comment added", 201);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

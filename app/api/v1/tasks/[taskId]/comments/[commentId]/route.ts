import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { Comment } from "@/types/deal.types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string; commentId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { taskId, commentId } = await params;
    const body = await request.json();
    if (!body.body?.trim()) return apiError("Comment body is required", 400);

    await initCrmSchema();
    await crmExecute(
      "UPDATE task_comments SET body = ?, updated_at = NOW() WHERE id = ? AND task_id = ?",
      [body.body.trim(), commentId, taskId]
    );

    const rows = await crmQuery<MysqlRow>(
      `SELECT c.*, u.first_name, u.last_name, u.profile_photo_url
       FROM task_comments c
       LEFT JOIN users u ON u.id = c.author_id
       WHERE c.id = ? AND c.task_id = ?
       LIMIT 1`,
      [commentId, taskId]
    );

    if (!rows.length) return apiError("Comment not found", 404);

    const updated: Comment = {
      id: String(rows[0].id),
      parentCommentId: rows[0].parent_comment_id ? String(rows[0].parent_comment_id) : null,
      authorId: String(rows[0].author_id),
      authorName: `${rows[0].first_name || ""} ${rows[0].last_name || ""}`.trim() || "User",
      authorProfilePhotoUrl: rows[0].profile_photo_url || null,
      body: rows[0].body || "",
      createdAt: rows[0].created_at ? new Date(rows[0].created_at).toISOString() : new Date().toISOString(),
    };

    return apiSuccess(updated);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string; commentId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { taskId, commentId } = await params;
    await initCrmSchema();

    await crmExecute(
      "DELETE FROM task_comments WHERE (id = ? OR parent_comment_id = ?) AND task_id = ?",
      [commentId, commentId, taskId]
    );

    return apiSuccess({ success: true });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

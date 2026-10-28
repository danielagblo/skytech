import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { Comment } from "@/types/deal.types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string; logId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { logId } = await params;
    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>(
      `SELECT c.*, u.first_name, u.last_name, u.profile_photo_url
       FROM deal_log_comments c
       LEFT JOIN users u ON u.id = c.author_id
       WHERE c.deal_log_id = ?
       ORDER BY c.created_at ASC`,
      [logId]
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
      page: 0,
      size: content.length,
      totalElements: content.length,
      totalPages: 1,
      last: true,
    });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string; logId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { logId } = await params;
    const body = await request.json();
    if (!body.body) return apiError("Comment body is required", 400);

    await initCrmSchema();
    const commentId = newId();
    await crmExecute(
      `INSERT INTO deal_log_comments (id, company_id, deal_log_id, parent_comment_id, author_id, body)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [commentId, user.companyId || null, logId, body.parentCommentId || null, user.id, body.body]
    );

    const created: Comment = {
      id: commentId,
      parentCommentId: body.parentCommentId || null,
      authorId: user.id,
      authorName: `${user.firstName} ${user.lastName}`.trim(),
      authorProfilePhotoUrl: user.profilePhotoUrl,
      body: body.body,
      createdAt: new Date().toISOString(),
    };

    return apiSuccess(created, "Comment added", 201);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

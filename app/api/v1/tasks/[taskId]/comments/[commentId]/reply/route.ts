import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, initCrmSchema, newId } from "@/lib/crm/db";
import { Comment } from "@/types/deal.types";

export async function POST(
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
    const replyId = newId();

    await crmExecute(
      `INSERT INTO task_comments (id, company_id, task_id, parent_comment_id, author_id, body, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [replyId, user.companyId || null, taskId, commentId, user.id, body.body.trim()]
    );

    const created: Comment = {
      id: replyId,
      parentCommentId: commentId,
      authorId: user.id,
      authorName: `${user.firstName} ${user.lastName}`.trim(),
      authorProfilePhotoUrl: user.profilePhotoUrl,
      body: body.body.trim(),
      createdAt: new Date().toISOString(),
    };

    return apiSuccess(created, "Reply added", 201);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

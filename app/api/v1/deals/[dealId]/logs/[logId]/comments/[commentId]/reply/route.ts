import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, initCrmSchema, newId } from "@/lib/crm/db";
import { Comment } from "@/types/deal.types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string; logId: string; commentId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { logId, commentId } = await params;
    const body = await request.json();
    if (!body.body?.trim()) return apiError("Comment body is required", 400);

    await initCrmSchema();
    const replyId = newId();

    await crmExecute(
      `INSERT INTO deal_log_comments (id, company_id, deal_log_id, parent_comment_id, author_id, body)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [replyId, user.companyId || null, logId, commentId, user.id, body.body.trim()]
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

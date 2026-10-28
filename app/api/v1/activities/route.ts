import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { Activity } from "@/types/activity.types";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>(
      `SELECT dl.id, dl.created_by, dl.log_type, dl.body, dl.created_at, d.title as deal_title
       FROM deal_logs dl
       JOIN deals d ON d.id = dl.deal_id
       ORDER BY dl.created_at DESC LIMIT 50`
    );

    const content: Activity[] = rows.map((r) => ({
      id: String(r.id),
      actorId: r.created_by ? String(r.created_by) : null,
      eventType: "LEAD_LOG_CALL",
      entityType: "DEAL",
      entityId: String(r.id),
      description: r.body || `Logged ${r.log_type} for ${r.deal_title}`,
      metadata: {},
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

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const body = await request.json();
    const activity: Activity = {
      id: Date.now().toString(),
      actorId: user.id,
      eventType: body.eventType || "LEAD_LOG_CALL",
      entityType: body.entityType || "SYSTEM",
      entityId: body.entityId || null,
      description: body.description || "",
      metadata: body.metadata || {},
      createdAt: new Date().toISOString(),
    };

    return apiSuccess(activity, "Activity logged", 201);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

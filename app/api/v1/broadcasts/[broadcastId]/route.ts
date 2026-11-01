import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatBroadcast } from "@/lib/crm/formatters";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ broadcastId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { broadcastId } = await params;
    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>("SELECT * FROM broadcasts WHERE id = ? LIMIT 1", [broadcastId]);
    if (!rows.length) return apiError("Broadcast not found", 404);

    return apiSuccess(formatBroadcast(rows[0]));
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ broadcastId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { broadcastId } = await params;
    const body = await request.json();
    await initCrmSchema();

    await crmExecute(
      `UPDATE broadcasts SET
        title = COALESCE(?, title),
        channel = COALESCE(?, channel),
        recipient_type = COALESCE(?, recipient_type),
        message = COALESCE(?, message),
        scheduled_for = COALESCE(?, scheduled_for),
        updated_at = NOW()
      WHERE id = ?`,
      [
        body.name || body.title || null,
        body.channel || null,
        body.recipientType || null,
        body.messageContent || body.message || null,
        body.scheduledAt ? new Date(body.scheduledAt) : null,
        broadcastId,
      ]
    );

    const rows = await crmQuery<MysqlRow>("SELECT * FROM broadcasts WHERE id = ? LIMIT 1", [broadcastId]);
    if (!rows.length) return apiError("Broadcast not found", 404);

    return apiSuccess(formatBroadcast(rows[0]));
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ broadcastId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { broadcastId } = await params;
    await initCrmSchema();
    await crmExecute("DELETE FROM broadcasts WHERE id = ?", [broadcastId]);

    return apiSuccess({ success: true });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

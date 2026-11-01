import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatBroadcast } from "@/lib/crm/formatters";

export async function POST(
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

    await crmExecute(
      `UPDATE broadcasts SET
        status = 'SENT',
        sent_at = NOW(),
        updated_at = NOW()
      WHERE id = ?`,
      [broadcastId]
    );

    const updatedRows = await crmQuery<MysqlRow>("SELECT * FROM broadcasts WHERE id = ? LIMIT 1", [broadcastId]);
    return apiSuccess(formatBroadcast(updatedRows[0]), "Broadcast sent successfully");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

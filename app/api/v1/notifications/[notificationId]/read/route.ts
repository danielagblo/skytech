import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatNotification } from "@/lib/crm/formatters";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { notificationId } = await params;
    await initCrmSchema();
    await crmExecute("UPDATE in_app_notifications SET is_read = 1, read_at = NOW() WHERE id = ?", [notificationId]);

    const rows = await crmQuery<MysqlRow>("SELECT * FROM in_app_notifications WHERE id = ? LIMIT 1", [notificationId]);
    if (!rows.length) return apiError("Notification not found", 404);

    return apiSuccess(formatNotification(rows[0]), "Marked read");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

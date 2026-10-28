import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema } from "@/lib/crm/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rows = await crmQuery<{ count: number }>(
      "SELECT COUNT(*) as count FROM in_app_notifications WHERE user_id = ? AND is_read = 0",
      [user.id]
    );

    return apiSuccess({ count: Number(rows[0]?.count || 0) });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, initCrmSchema } from "@/lib/crm/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    await crmExecute("UPDATE in_app_notifications SET is_read = 1, read_at = NOW() WHERE user_id = ?", [user.id]);

    return apiSuccess(null, "All marked read");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

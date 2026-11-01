import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatAutomation } from "@/lib/crm/formatters";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>(
      "SELECT * FROM automations WHERE trigger_type IN ('PAYMENT_REMINDER', 'PAYMENT', 'PAYMENT_RECEIVED') ORDER BY created_at DESC"
    );
    const content = rows.map(formatAutomation);

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

import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatBroadcast } from "@/lib/crm/formatters";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get("days") || "7", 10);

    const rows = await crmQuery<MysqlRow>(
      "SELECT * FROM broadcasts WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) ORDER BY created_at DESC",
      [days]
    );

    const content = rows.map(formatBroadcast);

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

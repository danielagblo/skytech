import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatDealLog } from "@/lib/crm/formatters";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string; logId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { logId } = await params;
    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>("SELECT * FROM deal_logs WHERE id = ? LIMIT 1", [logId]);
    if (!rows.length) return apiError("Log not found", 404);

    return apiSuccess(formatDealLog(rows[0]));
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string; logId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { logId } = await params;
    await initCrmSchema();
    await crmExecute("DELETE FROM deal_logs WHERE id = ?", [logId]);
    return apiSuccess(null, "Log deleted");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

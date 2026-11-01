import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatAutomation } from "@/lib/crm/formatters";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ automationId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { automationId } = await params;
    await initCrmSchema();

    const rows = await crmQuery<MysqlRow>("SELECT * FROM automations WHERE id = ? LIMIT 1", [automationId]);
    if (!rows.length) return apiError("Automation not found", 404);

    const currentActive = Boolean(rows[0].is_active);
    const newActive = !currentActive ? 1 : 0;

    await crmExecute("UPDATE automations SET is_active = ?, updated_at = NOW() WHERE id = ?", [
      newActive,
      automationId,
    ]);

    const updatedRows = await crmQuery<MysqlRow>("SELECT * FROM automations WHERE id = ? LIMIT 1", [automationId]);
    return apiSuccess(formatAutomation(updatedRows[0]));
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatAutomation } from "@/lib/crm/formatters";

export async function GET(
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

    return apiSuccess(formatAutomation(rows[0]));
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ automationId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { automationId } = await params;
    const body = await request.json();
    await initCrmSchema();

    const config = JSON.stringify({
      triggerConfig: body.triggerConfig || {},
      contactIds: body.contactIds || [],
      steps: body.steps || [],
    });

    await crmExecute(
      `UPDATE automations SET
        name = COALESCE(?, name),
        trigger_type = COALESCE(?, trigger_type),
        is_active = COALESCE(?, is_active),
        config = COALESCE(?, config),
        updated_at = NOW()
      WHERE id = ?`,
      [
        body.name ?? null,
        body.automationType ?? null,
        typeof body.active === "boolean" ? (body.active ? 1 : 0) : null,
        config,
        automationId,
      ]
    );

    const rows = await crmQuery<MysqlRow>("SELECT * FROM automations WHERE id = ? LIMIT 1", [automationId]);
    if (!rows.length) return apiError("Automation not found", 404);

    return apiSuccess(formatAutomation(rows[0]));
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ automationId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { automationId } = await params;
    await initCrmSchema();
    await crmExecute("DELETE FROM automations WHERE id = ?", [automationId]);

    return apiSuccess({ success: true });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

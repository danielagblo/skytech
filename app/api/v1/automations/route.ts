import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { Automation } from "@/types/automation.types";

export function formatAutomation(row: MysqlRow): Automation {
  let cfg: any = {};
  if (typeof row.config === "string") {
    try { cfg = JSON.parse(row.config); } catch {}
  } else if (typeof row.config === "object" && row.config !== null) {
    cfg = row.config;
  }

  return {
    id: String(row.id),
    automationType: (row.trigger_type || "BIRTHDAY") as any,
    name: row.name || "Untitled Automation",
    active: Boolean(row.is_active),
    triggerConfig: cfg.triggerConfig || {},
    contactIds: cfg.contactIds || [],
    steps: cfg.steps || [],
    createdById: row.created_by ? String(row.created_by) : "",
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>("SELECT * FROM automations ORDER BY created_at DESC");
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

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const body = await request.json();
    const id = newId();

    const config = JSON.stringify({
      triggerConfig: body.triggerConfig || {},
      contactIds: body.contactIds || [],
      steps: body.steps || [],
    });

    await crmExecute(
      "INSERT INTO automations (id, company_id, name, trigger_type, is_active, config) VALUES (?, ?, ?, ?, ?, ?)",
      [id, user.companyId || null, body.name || "Automation", body.automationType || "BIRTHDAY", body.active !== false ? 1 : 0, config]
    );

    const rows = await crmQuery<MysqlRow>("SELECT * FROM automations WHERE id = ?", [id]);
    return apiSuccess(formatAutomation(rows[0]), "Automation created", 201);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

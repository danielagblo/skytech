import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import type { LeadAssignmentConfig } from "@/types/lead.types";

const defaultLeadAssignment: LeadAssignmentConfig = {
  enabled: true,
  config: {
    strategy: "LEAST_LOADED",
  },
};

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>("SELECT lead_assignment FROM settings LIMIT 1");
    if (rows.length && rows[0].lead_assignment) {
      const parsed =
        typeof rows[0].lead_assignment === "string"
          ? JSON.parse(rows[0].lead_assignment)
          : rows[0].lead_assignment;
      return apiSuccess({
        enabled: Boolean(parsed.enabled ?? true),
        config: {
          strategy: parsed.config?.strategy || parsed.strategy || "LEAST_LOADED",
        },
      });
    }

    return apiSuccess(defaultLeadAssignment);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const body = await request.json();
    const payload: LeadAssignmentConfig = {
      enabled: Boolean(body.enabled ?? true),
      config: {
        strategy: body.config?.strategy || body.strategy || "LEAST_LOADED",
      },
    };

    const rows = await crmQuery<MysqlRow>("SELECT id FROM settings LIMIT 1");
    if (rows.length) {
      await crmExecute(
        "UPDATE settings SET lead_assignment = ? WHERE id = ?",
        [JSON.stringify(payload), rows[0].id]
      );
    } else {
      await crmExecute(
        "INSERT INTO settings (id, lead_assignment) VALUES (?, ?)",
        [newId(), JSON.stringify(payload)]
      );
    }

    return apiSuccess(payload, "Lead assignment settings saved");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

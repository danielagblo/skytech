import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatLead } from "@/lib/crm/formatters";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { leadId } = await params;
    const body = await request.json();
    await initCrmSchema();

    const assignees = Array.isArray(body.assignees) ? body.assignees : [];
    await crmExecute(
      "UPDATE leads SET assigned_to = ?, updated_at = NOW() WHERE id = ?",
      [JSON.stringify(assignees), leadId]
    );

    const updated = await crmQuery<MysqlRow>("SELECT * FROM leads WHERE id = ?", [leadId]);
    return apiSuccess(formatLead(updated[0]), "Lead assigned successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to assign lead", 500);
  }
}

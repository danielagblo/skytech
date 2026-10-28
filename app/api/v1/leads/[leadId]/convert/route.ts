import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { formatDeal } from "@/lib/crm/formatters";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { leadId } = await params;
    const body = await request.json().catch(() => ({}));
    await initCrmSchema();

    const leads = await crmQuery<MysqlRow>(
      "SELECT * FROM leads WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [leadId]
    );
    if (!leads.length) return apiError("Lead not found", 404);
    const lead = leads[0];

    const dealId = newId();
    const title = body.title || `${lead.company_name || lead.first_name || "New"} Deal`;
    const contractValue = body.contractValue || 0;

    await crmExecute(
      `INSERT INTO deals (
        id, company_id, lead_id, created_by, assigned_to,
        title, stage, priority, contract_value, total_paid, arrears, is_paid_in_full
      ) VALUES (?, ?, ?, ?, ?, ?, 'PROSPECTING', ?, ?, 0, ?, 0)`,
      [
        dealId,
        user.companyId || null,
        leadId,
        user.id,
        user.id,
        title,
        lead.priority || "MEDIUM",
        contractValue,
        contractValue,
      ]
    );

    await crmExecute("UPDATE leads SET status = 'CONVERTED', updated_at = NOW() WHERE id = ?", [leadId]);

    const created = await crmQuery<MysqlRow>("SELECT * FROM deals WHERE id = ?", [dealId]);
    return apiSuccess(formatDeal(created[0]), "Lead converted to deal successfully", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to convert lead", 500);
  }
}

import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { formatDeal, parseCurrencyAmount } from "@/lib/crm/formatters";
import { camelize } from "@/lib/case-conversion";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { leadId } = await params;
    const rawBody = await request.json().catch(() => ({}));
    const body = (camelize(rawBody) || {}) as any;
    await initCrmSchema();

    const leads = await crmQuery<MysqlRow>(
      "SELECT * FROM leads WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [leadId]
    );
    if (!leads.length) return apiError("Lead not found", 404);
    const lead = leads[0];

    const dealId = newId();
    const leadName = `${lead.company_name || `${lead.first_name || ""} ${lead.last_name || ""}`.trim() || "New"} Deal`;
    const title = (body.title || rawBody.title)?.trim() || leadName;
    const rawContract = body.contractValue !== undefined 
      ? body.contractValue 
      : rawBody.contract_value !== undefined 
      ? rawBody.contract_value 
      : rawBody.contractValue;
    const contractValue = parseCurrencyAmount(rawContract);
    const currency = body.currency || rawBody.currency || "GHS";
    const assignedTo = body.assignedToId || rawBody.assigned_to_id || rawBody.assignedToId || lead.assigned_to || user.id;
    const priority = body.priority || rawBody.priority || lead.priority || "MEDIUM";

    await crmExecute(
      `INSERT INTO deals (
        id, company_id, lead_id, created_by, assigned_to,
        title, stage, priority, currency, contract_value, total_paid, arrears, is_paid_in_full
      ) VALUES (?, ?, ?, ?, ?, ?, 'PROSPECTING', ?, ?, ?, 0, ?, 0)`,
      [
        dealId,
        user.companyId || null,
        leadId,
        user.id,
        assignedTo,
        title,
        priority,
        currency,
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

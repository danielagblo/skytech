import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatDeal, parseAssigneeIds, parseCurrencyAmount } from "@/lib/crm/formatters";
import { camelize } from "@/lib/case-conversion";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { dealId } = await params;
    await initCrmSchema();
    const rows = await crmQuery<MysqlRow>(
      "SELECT * FROM deals WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [dealId]
    );

    if (!rows.length) return apiError("Deal not found", 404);
    return apiSuccess(formatDeal(rows[0]));
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch deal", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { dealId } = await params;
    const rawBody = await request.json().catch(() => ({}));
    const body = (camelize(rawBody) || {}) as any;
    await initCrmSchema();

    const existing = await crmQuery<MysqlRow>(
      "SELECT * FROM deals WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [dealId]
    );
    if (!existing.length) return apiError("Deal not found", 404);

    const rawContract = body.contractValue !== undefined 
      ? body.contractValue 
      : rawBody.contract_value !== undefined 
      ? rawBody.contract_value 
      : rawBody.contractValue;
    const contractValue = rawContract !== undefined 
      ? parseCurrencyAmount(rawContract) 
      : Number(existing[0].contract_value || 0);

    const rawPaid = body.totalPaid !== undefined 
      ? body.totalPaid 
      : rawBody.total_paid !== undefined 
      ? rawBody.total_paid 
      : rawBody.totalPaid;
    const totalPaid = rawPaid !== undefined 
      ? parseCurrencyAmount(rawPaid) 
      : Number(existing[0].total_paid || 0);

    const arrears = Math.max(0, contractValue - totalPaid);
    const isPaidInFull = arrears === 0 && contractValue > 0;
    const currency = body.currency || rawBody.currency || existing[0].currency || "GHS";
    const currentAssignees = parseAssigneeIds(existing[0].assignee_ids);
    const fallbackAssignees = currentAssignees.length
      ? currentAssignees
      : existing[0].assigned_to
        ? [String(existing[0].assigned_to)]
        : [];
    const assigneeIds = Array.isArray(body.assigneeIds)
      ? parseAssigneeIds(body.assigneeIds)
      : body.assignedToId
        ? [String(body.assignedToId)]
        : fallbackAssignees;
    const assignedTo = assigneeIds[0] || null;

    await crmExecute(
      `UPDATE deals SET
        title = COALESCE(?, title),
        stage = COALESCE(?, stage),
        priority = COALESCE(?, priority),
        currency = ?,
        contract_value = ?,
        total_paid = ?,
        arrears = ?,
        is_paid_in_full = ?,
        assigned_to = ?,
        assignee_ids = ?,
        notes = COALESCE(?, notes),
        updated_at = NOW()
      WHERE id = ?`,
      [
        body.title || rawBody.title || null,
        body.stage || rawBody.stage || null,
        body.priority || rawBody.priority || null,
        currency,
        contractValue,
        totalPaid,
        arrears,
        isPaidInFull ? 1 : 0,
        assignedTo,
        JSON.stringify(assigneeIds),
        body.notes || rawBody.notes || null,
        dealId,
      ]
    );

    const updated = await crmQuery<MysqlRow>("SELECT * FROM deals WHERE id = ?", [dealId]);
    return apiSuccess(formatDeal(updated[0]), "Deal updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update deal", 500);
  }
}

export const PATCH = PUT;

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);
    if (user.role !== "ADMIN") return apiError("Only an administrator can remove a deal", 403);

    const { dealId } = await params;
    await initCrmSchema();
    await crmExecute("UPDATE deals SET deleted_at = NOW() WHERE id = ?", [dealId]);
    return apiSuccess(null, "Deal deleted successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to delete deal", 500);
  }
}

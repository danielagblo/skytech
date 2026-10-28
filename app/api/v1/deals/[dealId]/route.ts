import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatDeal } from "@/lib/crm/formatters";

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
    const body = await request.json();
    await initCrmSchema();

    const existing = await crmQuery<MysqlRow>(
      "SELECT * FROM deals WHERE id = ? AND deleted_at IS NULL LIMIT 1",
      [dealId]
    );
    if (!existing.length) return apiError("Deal not found", 404);

    const contractValue = body.contractValue !== undefined ? Number(body.contractValue) : Number(existing[0].contract_value);
    const totalPaid = body.totalPaid !== undefined ? Number(body.totalPaid) : Number(existing[0].total_paid);
    const arrears = Math.max(0, contractValue - totalPaid);
    const isPaidInFull = arrears === 0 && contractValue > 0;

    await crmExecute(
      `UPDATE deals SET
        title = COALESCE(?, title),
        stage = COALESCE(?, stage),
        priority = COALESCE(?, priority),
        contract_value = ?,
        total_paid = ?,
        arrears = ?,
        is_paid_in_full = ?,
        assigned_to = COALESCE(?, assigned_to),
        notes = COALESCE(?, notes),
        updated_at = NOW()
      WHERE id = ?`,
      [
        body.title ?? null,
        body.stage ?? null,
        body.priority ?? null,
        contractValue,
        totalPaid,
        arrears,
        isPaidInFull ? 1 : 0,
        body.assignedToId ?? null,
        body.notes ?? null,
        dealId,
      ]
    );

    const updated = await crmQuery<MysqlRow>("SELECT * FROM deals WHERE id = ?", [dealId]);
    return apiSuccess(formatDeal(updated[0]), "Deal updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update deal", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { dealId } = await params;
    await initCrmSchema();
    await crmExecute("UPDATE deals SET deleted_at = NOW() WHERE id = ?", [dealId]);
    return apiSuccess(null, "Deal deleted successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to delete deal", 500);
  }
}

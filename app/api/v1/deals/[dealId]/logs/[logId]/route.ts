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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string; logId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { dealId, logId } = await params;
    const body = await request.json();
    await initCrmSchema();

    await crmExecute(
      `UPDATE deal_logs SET
        log_type = COALESCE(?, log_type),
        contact_mode = COALESCE(?, contact_mode),
        response_type = COALESCE(?, response_type),
        follow_up_at = COALESCE(?, follow_up_at),
        settlement_value = COALESCE(?, settlement_value),
        amount_paid = COALESCE(?, amount_paid),
        payment_mode = COALESCE(?, payment_mode),
        invoice_number = COALESCE(?, invoice_number),
        receipt_number = COALESCE(?, receipt_number),
        invoice_issued = COALESCE(?, invoice_issued),
        service_type = COALESCE(?, service_type),
        body = COALESCE(?, body),
        updated_at = NOW()
      WHERE id = ? AND deal_id = ?`,
      [
        body.logType ?? null,
        body.contactMode ?? null,
        body.responseType ?? null,
        body.followUpAt ? new Date(body.followUpAt) : null,
        body.settlementValue ?? null,
        body.amountPaid ?? null,
        body.paymentMode ?? null,
        body.invoiceNumber ?? null,
        body.receiptNumber ?? null,
        typeof body.invoiceIssued === "boolean" ? (body.invoiceIssued ? 1 : 0) : null,
        body.serviceType ?? null,
        body.body ?? null,
        logId,
        dealId,
      ]
    );

    const rows = await crmQuery<MysqlRow>(
      "SELECT * FROM deal_logs WHERE id = ? AND deal_id = ? LIMIT 1",
      [logId, dealId]
    );
    if (!rows.length) return apiError("Log not found", 404);

    return apiSuccess(formatDealLog(rows[0]), "Log updated successfully");
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

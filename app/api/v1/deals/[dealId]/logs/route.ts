import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { DealLog } from "@/types/deal.types";

export function formatDealLog(row: MysqlRow): DealLog {
  return {
    id: String(row.id),
    dealId: String(row.deal_id),
    createdById: row.created_by ? String(row.created_by) : "",
    logType: row.log_type || "NEGOTIATION",
    contactMode: row.contact_mode || null,
    responseType: row.response_type || null,
    callDirection: null,
    callDurationSeconds: null,
    callOutcome: null,
    followUpAt: row.follow_up_at ? new Date(row.follow_up_at).toISOString() : null,
    settlementValue: row.settlement_value ? Number(row.settlement_value) : null,
    settlementFollowUp: row.settlement_follow_up ? new Date(row.settlement_follow_up).toISOString() : null,
    specialConditions: row.special_conditions || null,
    amountPaid: row.amount_paid ? Number(row.amount_paid) : null,
    paymentMode: row.payment_mode || null,
    invoiceNumber: row.invoice_number || null,
    receiptNumber: row.receipt_number || null,
    invoiceIssued: Boolean(row.invoice_issued),
    serviceType: row.service_type || null,
    expiryDate: row.expiry_date ? new Date(row.expiry_date).toISOString().slice(0, 10) : null,
    retentionAmount: row.retention_amount ? Number(row.retention_amount) : null,
    retentionInvoice: row.retention_invoice || null,
    retentionReceipt: row.retention_receipt || null,
    autoReviewScore: row.auto_review_score || null,
    body: row.body || null,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
  };
}

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
      "SELECT * FROM deal_logs WHERE deal_id = ? ORDER BY created_at DESC",
      [dealId]
    );

    const content = rows.map(formatDealLog);
    return apiSuccess({
      content,
      page: 0,
      size: content.length,
      totalElements: content.length,
      totalPages: 1,
      last: true,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch logs", 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { dealId } = await params;
    const body = await request.json();
    await initCrmSchema();

    const logId = newId();
    await crmExecute(
      `INSERT INTO deal_logs (
        id, company_id, deal_id, created_by, log_type,
        contact_mode, response_type, follow_up_at, settlement_value,
        amount_paid, payment_mode, invoice_number, receipt_number,
        invoice_issued, service_type, body
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        logId,
        user.companyId || null,
        dealId,
        user.id,
        body.logType || "NEGOTIATION",
        body.contactMode || null,
        body.responseType || null,
        body.followUpAt ? new Date(body.followUpAt) : null,
        body.settlementValue || null,
        body.amountPaid || null,
        body.paymentMode || null,
        body.invoiceNumber || null,
        body.receiptNumber || null,
        body.invoiceIssued ? 1 : 0,
        body.serviceType || null,
        body.body || null,
      ]
    );

    // If payment amount is logged, update deal total_paid and arrears
    if (body.amountPaid && Number(body.amountPaid) > 0) {
      await crmExecute(
        `UPDATE deals SET 
          total_paid = total_paid + ?,
          arrears = GREATEST(0, contract_value - (total_paid + ?)),
          is_paid_in_full = (contract_value <= (total_paid + ?)),
          updated_at = NOW()
        WHERE id = ?`,
        [body.amountPaid, body.amountPaid, body.amountPaid, dealId]
      );
    }

    const created = await crmQuery<MysqlRow>("SELECT * FROM deal_logs WHERE id = ?", [logId]);
    return apiSuccess(formatDealLog(created[0]), "Log added successfully", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to add log", 500);
  }
}

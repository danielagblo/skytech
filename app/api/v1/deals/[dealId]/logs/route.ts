import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { formatDealLog, parseCurrencyAmount } from "@/lib/crm/formatters";
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
    const rawBody = await request.json().catch(() => ({}));
    const body = (camelize(rawBody) || {}) as any;
    await initCrmSchema();

    const rawSettlement = body.settlementValue !== undefined && body.settlementValue !== null
      ? body.settlementValue
      : rawBody.settlement_value !== undefined && rawBody.settlement_value !== null
      ? rawBody.settlement_value
      : null;
    const settlementVal = rawSettlement !== null ? parseCurrencyAmount(rawSettlement) : null;

    const rawAmountPaid = body.amountPaid !== undefined && body.amountPaid !== null
      ? body.amountPaid
      : rawBody.amount_paid !== undefined && rawBody.amount_paid !== null
      ? rawBody.amount_paid
      : null;
    const amountPaid = rawAmountPaid !== null ? parseCurrencyAmount(rawAmountPaid) : null;

    const rawRetention = body.retentionAmount !== undefined && body.retentionAmount !== null
      ? body.retentionAmount
      : rawBody.retention_amount !== undefined && rawBody.retention_amount !== null
      ? rawBody.retention_amount
      : null;
    const retentionAmt = rawRetention !== null ? parseCurrencyAmount(rawRetention) : null;

    const logId = newId();
    await crmExecute(
      `INSERT INTO deal_logs (
        id, company_id, deal_id, created_by, log_type,
        contact_mode, response_type, follow_up_at,
        settlement_value, settlement_follow_up, special_conditions,
        amount_paid, payment_mode, invoice_number, receipt_number,
        invoice_issued, service_type, expiry_date,
        retention_amount, retention_invoice, retention_receipt, body
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        logId,
        user.companyId || null,
        dealId,
        user.id,
        body.logType || rawBody.log_type || "NEGOTIATION",
        body.contactMode || rawBody.contact_mode || null,
        body.responseType || rawBody.response_type || null,
        (body.followUpAt || rawBody.follow_up_at) ? new Date(body.followUpAt || rawBody.follow_up_at) : null,
        settlementVal,
        (body.settlementFollowUp || rawBody.settlement_follow_up) ? new Date(body.settlementFollowUp || rawBody.settlement_follow_up) : null,
        body.specialConditions || rawBody.special_conditions || null,
        amountPaid,
        body.paymentMode || rawBody.payment_mode || null,
        body.invoiceNumber || rawBody.invoice_number || null,
        body.receiptNumber || rawBody.receipt_number || null,
        (body.invoiceIssued ?? rawBody.invoice_issued) ? 1 : 0,
        body.serviceType || rawBody.service_type || null,
        (body.expiryDate || rawBody.expiry_date) ? new Date(body.expiryDate || rawBody.expiry_date) : null,
        retentionAmt,
        body.retentionInvoice || rawBody.retention_invoice || null,
        body.retentionReceipt || rawBody.retention_receipt || null,
        body.body || rawBody.body || null,
      ]
    );

    // If agreed settlement value is logged, update deal contract_value and recalculate arrears
    if (settlementVal !== null && settlementVal > 0) {
      await crmExecute(
        `UPDATE deals SET 
          contract_value = ?,
          arrears = GREATEST(0, contract_value - total_paid),
          is_paid_in_full = (contract_value > 0 AND total_paid >= contract_value),
          updated_at = NOW()
        WHERE id = ?`,
        [settlementVal, dealId]
      );
    }

    // If payment amount is logged, update deal total_paid and arrears
    if (amountPaid !== null && amountPaid > 0) {
      await crmExecute(
        `UPDATE deals SET 
          total_paid = total_paid + ?,
          arrears = GREATEST(0, contract_value - total_paid),
          is_paid_in_full = (contract_value > 0 AND total_paid >= contract_value),
          updated_at = NOW()
        WHERE id = ?`,
        [amountPaid, dealId]
      );
    }

    // If retention service renewed, update renewal costs and expiry on deal
    if (body.logType === "CLIENT_RETENTION" && body.serviceType) {
      const expiry = body.expiryDate ? new Date(body.expiryDate) : null;
      if (body.serviceType === "DOMAIN") {
        await crmExecute(
          "UPDATE deals SET domain_cost = COALESCE(?, domain_cost), domain_expiry = COALESCE(?, domain_expiry), updated_at = NOW() WHERE id = ?",
          [retentionAmt, expiry, dealId]
        );
      } else if (body.serviceType === "HOSTING") {
        await crmExecute(
          "UPDATE deals SET hosting_cost = COALESCE(?, hosting_cost), hosting_expiry = COALESCE(?, hosting_expiry), updated_at = NOW() WHERE id = ?",
          [retentionAmt, expiry, dealId]
        );
      } else if (body.serviceType === "MAINTENANCE") {
        await crmExecute(
          "UPDATE deals SET maintenance_cost = COALESCE(?, maintenance_cost), maintenance_expiry = COALESCE(?, maintenance_expiry), updated_at = NOW() WHERE id = ?",
          [retentionAmt, expiry, dealId]
        );
      }
    }

    const created = await crmQuery<MysqlRow>("SELECT * FROM deal_logs WHERE id = ?", [logId]);
    return apiSuccess(formatDealLog(created[0]), "Log added successfully", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to add log", 500);
  }
}

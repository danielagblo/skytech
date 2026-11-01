import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { formatDealLog, parseCurrencyAmount } from "@/lib/crm/formatters";

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

    const settlementVal = body.settlementValue !== undefined && body.settlementValue !== null
      ? parseCurrencyAmount(body.settlementValue)
      : null;
    const amountPaid = body.amountPaid !== undefined && body.amountPaid !== null
      ? parseCurrencyAmount(body.amountPaid)
      : null;
    const retentionAmt = body.retentionAmount !== undefined && body.retentionAmount !== null
      ? parseCurrencyAmount(body.retentionAmount)
      : null;

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
        body.logType || "NEGOTIATION",
        body.contactMode || null,
        body.responseType || null,
        body.followUpAt ? new Date(body.followUpAt) : null,
        settlementVal,
        body.settlementFollowUp ? new Date(body.settlementFollowUp) : null,
        body.specialConditions || null,
        amountPaid,
        body.paymentMode || null,
        body.invoiceNumber || null,
        body.receiptNumber || null,
        body.invoiceIssued ? 1 : 0,
        body.serviceType || null,
        body.expiryDate ? new Date(body.expiryDate) : null,
        retentionAmt,
        body.retentionInvoice || null,
        body.retentionReceipt || null,
        body.body || null,
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

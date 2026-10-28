import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { formatInvoice } from "@/lib/crm/formatters";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { invoiceId } = await params;
    const body = await request.json();
    const amount = Number(body.amount) || 0;
    if (amount <= 0) return apiError("Amount must be greater than 0", 400);

    await initCrmSchema();
    const invRows = await crmQuery<MysqlRow>("SELECT * FROM invoices WHERE id = ? LIMIT 1", [invoiceId]);
    if (!invRows.length) return apiError("Invoice not found", 404);

    const inv = invRows[0];
    const newAmountPaid = Number(inv.amount_paid || 0) + amount;
    const total = Number(inv.total || 0);
    const newBalanceDue = Math.max(0, total - newAmountPaid);
    const newStatus = newBalanceDue === 0 ? "PAID" : "PARTIALLY_PAID";

    const paymentId = newId();
    await crmExecute(
      `INSERT INTO invoice_payments (id, company_id, invoice_id, recorded_by, amount, payment_mode, reference)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        paymentId,
        user.companyId || null,
        invoiceId,
        user.id,
        amount,
        body.paymentMode || "MOMO",
        body.reference || null,
      ]
    );

    await crmExecute(
      "UPDATE invoices SET amount_paid = ?, balance_due = ?, status = ?, paid_at = IF(? = 'PAID', NOW(), paid_at), updated_at = NOW() WHERE id = ?",
      [newAmountPaid, newBalanceDue, newStatus, newStatus, invoiceId]
    );

    // Also update deal total paid if linked
    if (inv.deal_id) {
      await crmExecute(
        `UPDATE deals SET 
          total_paid = total_paid + ?,
          arrears = GREATEST(0, contract_value - (total_paid + ?)),
          is_paid_in_full = (contract_value <= (total_paid + ?)),
          updated_at = NOW()
        WHERE id = ?`,
        [amount, amount, amount, inv.deal_id]
      );
    }

    const updatedInv = await crmQuery<MysqlRow>("SELECT * FROM invoices WHERE id = ?", [invoiceId]);
    const items = await crmQuery<MysqlRow>("SELECT * FROM invoice_items WHERE invoice_id = ?", [invoiceId]);
    const payments = await crmQuery<MysqlRow>("SELECT * FROM invoice_payments WHERE invoice_id = ?", [invoiceId]);

    return apiSuccess(formatInvoice(updatedInv[0], items, payments), "Payment recorded", 201);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

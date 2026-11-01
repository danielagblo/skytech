import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { formatInvoice } from "@/lib/crm/formatters";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { invoiceId } = await params;
    const body = await request.json().catch(() => ({}));
    await initCrmSchema();

    const rows = await crmQuery<MysqlRow>("SELECT * FROM invoices WHERE id = ? LIMIT 1", [invoiceId]);
    if (!rows.length) return apiError("Invoice not found", 404);

    await crmExecute(
      `UPDATE invoices SET
        status = 'SENT',
        recipient_email = COALESCE(?, recipient_email),
        updated_at = NOW()
      WHERE id = ?`,
      [body.email || null, invoiceId]
    );

    const updatedRows = await crmQuery<MysqlRow>("SELECT * FROM invoices WHERE id = ? LIMIT 1", [invoiceId]);
    const items = await crmQuery<MysqlRow>("SELECT * FROM invoice_items WHERE invoice_id = ?", [invoiceId]);
    const payments = await crmQuery<MysqlRow>("SELECT * FROM invoice_payments WHERE invoice_id = ?", [invoiceId]);

    return apiSuccess(formatInvoice(updatedRows[0], items, payments), "Invoice sent successfully");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

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
    await initCrmSchema();
    await crmExecute(
      "UPDATE invoices SET status = 'ISSUED', issued_at = NOW(), updated_at = NOW() WHERE id = ?",
      [invoiceId]
    );

    const rows = await crmQuery<MysqlRow>("SELECT * FROM invoices WHERE id = ? LIMIT 1", [invoiceId]);
    if (!rows.length) return apiError("Invoice not found", 404);

    const items = await crmQuery<MysqlRow>("SELECT * FROM invoice_items WHERE invoice_id = ?", [invoiceId]);
    const payments = await crmQuery<MysqlRow>("SELECT * FROM invoice_payments WHERE invoice_id = ?", [invoiceId]);

    return apiSuccess(formatInvoice(rows[0], items, payments), "Invoice issued");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

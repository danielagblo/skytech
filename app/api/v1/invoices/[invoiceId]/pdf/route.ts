import { readFile } from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";
import { getAuthUser, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";
import { stampInvoiceTemplate } from "@/lib/crm/invoice-template";
import { formatDate } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { invoiceId } = await params;
    await initCrmSchema();

    const rows = await crmQuery<MysqlRow>("SELECT * FROM invoices WHERE id = ? LIMIT 1", [invoiceId]);
    if (!rows.length) return apiError("Invoice not found", 404);

    const invoice = rows[0];
    const items = await crmQuery<MysqlRow>(
      "SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY position ASC, created_at ASC",
      [invoiceId]
    );

    const template = await readFile(
      path.join(process.cwd(), "public", "assets", "skytech-invoice-template.pdf"),
    );
    const issued = invoice.issue_date || invoice.issued_at || invoice.created_at;
    const address = [invoice.recipient_email, invoice.recipient_address]
      .filter(Boolean)
      .join("\n");
    const pdfBytes = await stampInvoiceTemplate(new Uint8Array(template), {
      clientName: String(invoice.recipient_name || "Client"),
      clientCompany: invoice.recipient_company ? String(invoice.recipient_company) : undefined,
      clientAddress: address || undefined,
      invoiceNo: String(invoice.invoice_number || `INV-${String(invoice.id).slice(0, 8)}`),
      date: issued ? formatDate(issued) : "—",
      dueDate: invoice.due_date ? formatDate(invoice.due_date) : "Upon receipt",
      items: items.map((item) => ({
        description: String(item.description || "Item"),
        rate: Number(item.unit_price || 0),
        qty: Number(item.quantity || 0),
      })),
      taxRatePercent: Number(invoice.tax_rate || 0),
      discountAmount: Number(invoice.discount_amount || 0),
      currencySymbol: "GH\u00A2",
      amountPaid: Number(invoice.amount_paid || 0),
      notes: invoice.notes ? String(invoice.notes) : undefined,
    });
    const pdfBuffer = Buffer.from(pdfBytes);
    const invNumber = invoice.invoice_number || `INV-${String(invoice.id).slice(0, 8)}`;

    return new Response(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invNumber}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

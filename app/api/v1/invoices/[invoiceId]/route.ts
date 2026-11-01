import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { formatInvoice } from "@/lib/crm/formatters";

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

    const items = await crmQuery<MysqlRow>("SELECT * FROM invoice_items WHERE invoice_id = ?", [invoiceId]);
    const payments = await crmQuery<MysqlRow>("SELECT * FROM invoice_payments WHERE invoice_id = ?", [invoiceId]);

    return apiSuccess(formatInvoice(rows[0], items, payments));
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function PUT(
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

    const current = rows[0];
    const body = await request.json();

    let subtotal = Number(current.subtotal || 0);
    let taxRate = body.taxRate !== undefined ? Number(body.taxRate) : Number(current.tax_rate || 0);
    let discountAmount = body.discountAmount !== undefined ? Number(body.discountAmount) : Number(current.discount_amount || 0);
    let taxAmount = Number(current.tax_amount || 0);
    let total = Number(current.total || 0);
    const amountPaid = Number(current.amount_paid || 0);

    if (Array.isArray(body.items)) {
      subtotal = 0;
      body.items.forEach((it: any) => {
        subtotal += (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0);
      });
      taxAmount = (subtotal * taxRate) / 100;
      total = Math.max(0, subtotal + taxAmount - discountAmount);

      await crmExecute("DELETE FROM invoice_items WHERE invoice_id = ?", [invoiceId]);
      for (let i = 0; i < body.items.length; i++) {
        const it = body.items[i];
        const itemId = newId();
        const qty = Number(it.quantity) || 1;
        const price = Number(it.unitPrice) || 0;
        await crmExecute(
          `INSERT INTO invoice_items (id, company_id, invoice_id, description, quantity, unit_price, amount, position)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [itemId, user.companyId || null, invoiceId, it.description || "", qty, price, qty * price, i]
        );
      }
    } else if (body.taxRate !== undefined || body.discountAmount !== undefined) {
      taxAmount = (subtotal * taxRate) / 100;
      total = Math.max(0, subtotal + taxAmount - discountAmount);
    }

    const balanceDue = Math.max(0, total - amountPaid);

    await crmExecute(
      `UPDATE invoices SET
        recipient_name = COALESCE(?, recipient_name),
        recipient_company = COALESCE(?, recipient_company),
        recipient_email = COALESCE(?, recipient_email),
        recipient_address = COALESCE(?, recipient_address),
        due_date = COALESCE(?, due_date),
        subtotal = ?,
        tax_rate = ?,
        tax_amount = ?,
        discount_amount = ?,
        total = ?,
        balance_due = ?,
        notes = COALESCE(?, notes),
        terms = COALESCE(?, terms),
        version = version + 1,
        updated_at = NOW()
      WHERE id = ?`,
      [
        body.recipientName ?? null,
        body.recipientCompany ?? null,
        body.recipientEmail ?? null,
        body.recipientAddress ?? null,
        body.dueDate ? new Date(body.dueDate) : null,
        subtotal,
        taxRate,
        taxAmount,
        discountAmount,
        total,
        balanceDue,
        body.notes ?? null,
        body.terms ?? null,
        invoiceId,
      ]
    );

    const updatedRows = await crmQuery<MysqlRow>("SELECT * FROM invoices WHERE id = ? LIMIT 1", [invoiceId]);
    const items = await crmQuery<MysqlRow>("SELECT * FROM invoice_items WHERE invoice_id = ?", [invoiceId]);
    const payments = await crmQuery<MysqlRow>("SELECT * FROM invoice_payments WHERE invoice_id = ?", [invoiceId]);

    return apiSuccess(formatInvoice(updatedRows[0], items, payments));
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    const { invoiceId } = await params;
    await initCrmSchema();
    await crmExecute("DELETE FROM invoice_items WHERE invoice_id = ?", [invoiceId]);
    await crmExecute("DELETE FROM invoice_payments WHERE invoice_id = ?", [invoiceId]);
    await crmExecute("DELETE FROM invoices WHERE id = ?", [invoiceId]);
    return apiSuccess(null, "Invoice deleted");
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

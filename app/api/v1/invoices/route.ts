import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { formatInvoice } from "@/lib/crm/formatters";
import { Invoice } from "@/types/invoice.types";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const url = new URL(request.url);
    const dealId = url.searchParams.get("deal_id");

    let whereSql = "WHERE 1=1";
    const params: any[] = [];
    if (dealId) {
      whereSql += " AND deal_id = ?";
      params.push(dealId);
    }

    const rows = await crmQuery<MysqlRow>(
      `SELECT * FROM invoices ${whereSql} ORDER BY created_at DESC`,
      params
    );

    const invoices: Invoice[] = [];
    for (const r of rows) {
      const items = await crmQuery<MysqlRow>("SELECT * FROM invoice_items WHERE invoice_id = ?", [r.id]);
      const payments = await crmQuery<MysqlRow>("SELECT * FROM invoice_payments WHERE invoice_id = ?", [r.id]);
      invoices.push(formatInvoice(r, items, payments));
    }

    return apiSuccess({
      content: invoices,
      page: 0,
      size: invoices.length,
      totalElements: invoices.length,
      totalPages: 1,
      last: true,
    });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const body = await request.json();
    const invoiceId = newId();
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    const items = Array.isArray(body.items) ? body.items : [];
    let subtotal = 0;
    items.forEach((it: any) => {
      subtotal += (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0);
    });

    const taxRate = Number(body.taxRate) || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const discountAmount = Number(body.discountAmount) || 0;
    const total = Math.max(0, subtotal + taxAmount - discountAmount);
    const balanceDue = total;

    await crmExecute(
      `INSERT INTO invoices (
        id, company_id, deal_id, created_by, invoice_number, status,
        recipient_name, recipient_company, recipient_email, recipient_address,
        due_date, currency, subtotal, tax_rate, tax_amount, discount_amount,
        total, amount_paid, balance_due, notes, terms
      ) VALUES (?, ?, ?, ?, ?, 'DRAFT', ?, ?, ?, ?, ?, 'GHS', ?, ?, ?, ?, ?, 0, ?, ?, ?)`,
      [
        invoiceId,
        user.companyId || null,
        body.dealId,
        user.id,
        invoiceNumber,
        body.recipientName || "Valued Client",
        body.recipientCompany || null,
        body.recipientEmail || null,
        body.recipientAddress || null,
        body.dueDate ? new Date(body.dueDate) : null,
        subtotal,
        taxRate,
        taxAmount,
        discountAmount,
        total,
        balanceDue,
        body.notes || null,
        body.terms || null,
      ]
    );

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const itemId = newId();
      const qty = Number(it.quantity) || 1;
      const price = Number(it.unitPrice) || 0;
      await crmExecute(
        `INSERT INTO invoice_items (id, company_id, invoice_id, description, quantity, unit_price, amount, position)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [itemId, user.companyId || null, invoiceId, it.description || "", qty, price, qty * price, i]
      );
    }

    const createdRows = await crmQuery<MysqlRow>("SELECT * FROM invoices WHERE id = ?", [invoiceId]);
    const createdItems = await crmQuery<MysqlRow>("SELECT * FROM invoice_items WHERE invoice_id = ?", [invoiceId]);

    return apiSuccess(formatInvoice(createdRows[0], createdItems, []), "Invoice created", 201);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

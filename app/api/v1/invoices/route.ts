import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/crm/auth";
import { crmExecute, crmQuery, initCrmSchema, MysqlRow, newId } from "@/lib/crm/db";
import { formatInvoice } from "@/lib/crm/formatters";
import { Invoice } from "@/types/invoice.types";
import { camelize } from "@/lib/case-conversion";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return apiError("Unauthorized", 401);

    await initCrmSchema();
    const url = new URL(request.url);
    const dealId = url.searchParams.get("deal_id") || url.searchParams.get("dealId");

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
    const rawBody = await request.json().catch(() => ({}));
    const body = (camelize(rawBody) || {}) as any;
    const invoiceId = newId();
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    const items = Array.isArray(body.items) ? body.items : [];
    let subtotal = 0;
    items.forEach((it: any) => {
      subtotal += (Number(it.quantity) || 1) * (Number(it.unitPrice ?? it.unit_price) || 0);
    });

    const taxRate = Number(body.taxRate ?? rawBody.tax_rate) || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const discountAmount = Number(body.discountAmount ?? rawBody.discount_amount) || 0;
    const total = Math.max(0, subtotal + taxAmount - discountAmount);
    const balanceDue = total;
    const dealId = body.dealId ?? rawBody.deal_id ?? rawBody.dealId ?? null;

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
        dealId,
        user.id,
        invoiceNumber,
        body.recipientName || rawBody.recipient_name || "Valued Client",
        body.recipientCompany || rawBody.recipient_company || null,
        body.recipientEmail || rawBody.recipient_email || null,
        body.recipientAddress || rawBody.recipient_address || null,
        (body.dueDate || rawBody.due_date) ? new Date(body.dueDate || rawBody.due_date) : null,
        subtotal,
        taxRate,
        taxAmount,
        discountAmount,
        total,
        balanceDue,
        body.notes || rawBody.notes || null,
        body.terms || rawBody.terms || null,
      ]
    );

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const unitPrice = Number(it.unitPrice ?? it.unit_price) || 0;
      const quantity = Number(it.quantity) || 1;
      const itemTotal = unitPrice * quantity;
      await crmExecute(
        `INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, total)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [newId(), invoiceId, it.description || "Service", quantity, unitPrice, itemTotal]
      );
    }

    const created = await crmQuery<MysqlRow>("SELECT * FROM invoices WHERE id = ?", [invoiceId]);
    const createdItems = await crmQuery<MysqlRow>("SELECT * FROM invoice_items WHERE invoice_id = ?", [invoiceId]);
    return apiSuccess(formatInvoice(created[0], createdItems, []), "Invoice created successfully", 201);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

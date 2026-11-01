import { NextRequest } from "next/server";
import { getAuthUser, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";

function buildInvoicePdf(invoice: MysqlRow, items: MysqlRow[]): Buffer {
  const invNumber = invoice.invoice_number || `INV-${String(invoice.id).slice(0, 8)}`;
  const cur = invoice.currency || "GHS";
  const subtotal = Number(invoice.subtotal || 0).toFixed(2);
  const taxRate = Number(invoice.tax_rate || 0);
  const taxAmount = Number(invoice.tax_amount || 0).toFixed(2);
  const discount = Number(invoice.discount_amount || 0).toFixed(2);
  const total = Number(invoice.total || 0).toFixed(2);
  const amountPaid = Number(invoice.amount_paid || 0).toFixed(2);
  const balanceDue = Number(invoice.balance_due || (Number(total) - Number(amountPaid))).toFixed(2);

  const lines: string[] = [
    `Skytech Ghana Limited - Enterprise Invoice`,
    `Invoice #: ${invNumber}   |   Status: ${invoice.status || "DRAFT"}`,
    `Due Date: ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "Upon Receipt"}`,
    `--------------------------------------------------------------------------------`,
    `Bill To: ${invoice.recipient_name || "Valued Client"}`,
  ];

  if (invoice.recipient_company) lines.push(`Company: ${invoice.recipient_company}`);
  if (invoice.recipient_email) lines.push(`Email: ${invoice.recipient_email}`);
  if (invoice.recipient_address) lines.push(`Address: ${invoice.recipient_address}`);

  lines.push(`--------------------------------------------------------------------------------`);
  lines.push(`ITEMS & SERVICES:`);

  if (!items.length) {
    lines.push(`(No line items listed)`);
  } else {
    items.forEach((it, idx) => {
      const desc = it.description || "Item";
      const qty = it.quantity || 1;
      const rate = Number(it.unit_price || 0).toFixed(2);
      const amt = Number(it.amount || (qty * Number(rate))).toFixed(2);
      lines.push(`${idx + 1}. ${desc} (Qty: ${qty} x ${cur} ${rate}) = ${cur} ${amt}`);
    });
  }

  lines.push(`--------------------------------------------------------------------------------`);
  lines.push(`Subtotal: ${cur} ${subtotal}`);
  if (Number(taxAmount) > 0) lines.push(`Tax (${taxRate}%): ${cur} ${taxAmount}`);
  if (Number(discount) > 0) lines.push(`Discount: -${cur} ${discount}`);
  lines.push(`Total Amount: ${cur} ${total}`);
  if (Number(amountPaid) > 0) lines.push(`Amount Paid: ${cur} ${amountPaid}`);
  lines.push(`Balance Due: ${cur} ${balanceDue}`);
  lines.push(`--------------------------------------------------------------------------------`);
  lines.push(`Thank you for your business. Skytech Ghana.`);

  const content = [
    "BT",
    "/F1 16 Tf",
    "50 780 Td",
    `(${invNumber}) Tj`,
    "/F1 10 Tf",
    ...lines.flatMap((line) => [
      "0 -18 Td",
      `(${line.replace(/[()\\\\]/g, "\\$&")}) Tj`,
    ]),
    "ET",
  ].join("\n");

  const stream = Buffer.from(content, "utf8");
  const streamLength = stream.length;

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj",
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj`,
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${content}\nendstream\nendobj`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj",
  ];

  let body = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(body, "utf8"));
    body += obj + "\n";
  }

  const xrefOffset = Buffer.byteLength(body, "utf8");
  let xref = "xref\n0 " + (objects.length + 1) + "\n0000000000 65535 f \n";
  for (const off of offsets) {
    xref += String(off).padStart(10, "0") + " 00000 n \n";
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(body + xref + trailer, "utf8");
}

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

    const pdfBuffer = buildInvoicePdf(invoice, items);
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

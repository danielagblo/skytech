import { NextRequest } from "next/server";
import * as React from "react";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { getAuthUser, apiError } from "@/lib/crm/auth";
import { crmQuery, initCrmSchema, MysqlRow } from "@/lib/crm/db";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1e293b",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
  },
  meta: {
    textAlign: "right",
  },
  metaText: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  table: {
    width: "100%",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    fontWeight: "bold",
    fontSize: 9,
    color: "#475569",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    fontSize: 9,
  },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 2, textAlign: "right" },
  colTotal: { flex: 2, textAlign: "right" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  summaryLabel: {
    width: 100,
    textAlign: "right",
    color: "#64748b",
    fontSize: 9,
    paddingRight: 10,
  },
  summaryVal: {
    width: 100,
    textAlign: "right",
    fontSize: 9,
    color: "#0f172a",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    marginTop: 6,
  },
  totalLabel: {
    width: 100,
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 11,
    color: "#0f172a",
    paddingRight: 10,
  },
  totalVal: {
    width: 100,
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 11,
    color: "#0f172a",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 10,
  },
});

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

    const invNumber = invoice.invoice_number || `INV-${invoice.id.slice(0, 8)}`;
    const cur = invoice.currency || "GHS";
    const subtotal = Number(invoice.subtotal || 0);
    const taxRate = Number(invoice.tax_rate || 0);
    const taxAmount = Number(invoice.tax_amount || 0);
    const discount = Number(invoice.discount_amount || 0);
    const total = Number(invoice.total || 0);
    const amountPaid = Number(invoice.amount_paid || 0);
    const balanceDue = Number(invoice.balance_due || (total - amountPaid));

    const invoiceDoc = React.createElement(
      Document,
      null,
      React.createElement(
        Page,
        { size: "A4", style: styles.page },
        React.createElement(
          View,
          { style: styles.header },
          React.createElement(
            View,
            null,
            React.createElement(Text, { style: styles.title }, "INVOICE"),
            React.createElement(Text, { style: styles.subtitle }, `Skytech CRM - ${invNumber}`)
          ),
          React.createElement(
            View,
            { style: styles.meta },
            React.createElement(Text, { style: styles.metaText }, `Status: ${invoice.status || "DRAFT"}`),
            React.createElement(
              Text,
              { style: styles.metaText },
              `Due: ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "Upon Receipt"}`
            )
          )
        ),
        React.createElement(
          View,
          { style: styles.section },
          React.createElement(Text, { style: styles.sectionTitle }, "Bill To:"),
          React.createElement(Text, { style: { fontWeight: "bold" } }, invoice.recipient_name || "Valued Client"),
          invoice.recipient_company ? React.createElement(Text, null, invoice.recipient_company) : null,
          invoice.recipient_email ? React.createElement(Text, null, invoice.recipient_email) : null,
          invoice.recipient_address ? React.createElement(Text, null, invoice.recipient_address) : null
        ),
        React.createElement(
          View,
          { style: styles.table },
          React.createElement(
            View,
            { style: styles.tableHeader },
            React.createElement(Text, { style: styles.colDesc }, "Item Description"),
            React.createElement(Text, { style: styles.colQty }, "Qty"),
            React.createElement(Text, { style: styles.colPrice }, `Rate (${cur})`),
            React.createElement(Text, { style: styles.colTotal }, `Amount (${cur})`)
          ),
          ...items.map((it, idx) =>
            React.createElement(
              View,
              { key: idx, style: styles.tableRow },
              React.createElement(Text, { style: styles.colDesc }, it.description || "-"),
              React.createElement(Text, { style: styles.colQty }, String(it.quantity || 1)),
              React.createElement(Text, { style: styles.colPrice }, Number(it.unit_price || 0).toFixed(2)),
              React.createElement(Text, { style: styles.colTotal }, Number(it.amount || 0).toFixed(2))
            )
          )
        ),
        React.createElement(
          View,
          { style: { marginTop: 12 } },
          React.createElement(
            View,
            { style: styles.summaryRow },
            React.createElement(Text, { style: styles.summaryLabel }, "Subtotal:"),
            React.createElement(Text, { style: styles.summaryVal }, `${cur} ${subtotal.toFixed(2)}`)
          ),
          taxAmount > 0
            ? React.createElement(
                View,
                { style: styles.summaryRow },
                React.createElement(Text, { style: styles.summaryLabel }, `Tax (${taxRate}%):`),
                React.createElement(Text, { style: styles.summaryVal }, `${cur} ${taxAmount.toFixed(2)}`)
              )
            : null,
          discount > 0
            ? React.createElement(
                View,
                { style: styles.summaryRow },
                React.createElement(Text, { style: styles.summaryLabel }, "Discount:"),
                React.createElement(Text, { style: styles.summaryVal }, `-${cur} ${discount.toFixed(2)}`)
              )
            : null,
          React.createElement(
            View,
            { style: styles.totalRow },
            React.createElement(Text, { style: styles.totalLabel }, "Total:"),
            React.createElement(Text, { style: styles.totalVal }, `${cur} ${total.toFixed(2)}`)
          ),
          amountPaid > 0
            ? React.createElement(
                View,
                { style: styles.summaryRow },
                React.createElement(Text, { style: styles.summaryLabel }, "Paid:"),
                React.createElement(Text, { style: styles.summaryVal }, `${cur} ${amountPaid.toFixed(2)}`)
              )
            : null,
          React.createElement(
            View,
            { style: styles.summaryRow },
            React.createElement(Text, { style: styles.summaryLabel }, "Balance Due:"),
            React.createElement(
              Text,
              { style: [styles.summaryVal, { fontWeight: "bold" }] },
              `${cur} ${balanceDue.toFixed(2)}`
            )
          )
        ),
        React.createElement(
          View,
          { style: styles.footer },
          React.createElement(Text, null, "Thank you for your business. Skytech Ghana.")
        )
      )
    );

    const pdfBuffer = await renderToBuffer(invoiceDoc);

    return new Response(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

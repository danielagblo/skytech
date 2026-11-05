"use client";

import {
  stampInvoiceTemplate,
  type InvoiceTemplateInput,
} from "@/lib/crm/invoice-template";
import type { InvoiceData } from "./InvoicePreview";

export type { InvoiceData, InvoiceLineItem } from "./InvoicePreview";

const TEMPLATE_URL = "/assets/skytech-invoice-template.pdf";

function toTemplate(data: InvoiceData): InvoiceTemplateInput {
  return {
    clientName: data.clientName,
    clientCompany: data.clientCompany,
    clientAddress: data.clientAddress,
    invoiceNo: data.invoiceNo,
    date: data.date,
    dueDate: data.dueDate,
    items: data.items ?? [],
    taxRatePercent: data.taxRatePercent ?? 0,
    discountAmount: data.discountAmount,
    currencySymbol: data.currencySymbol,
    amountPaid: data.amountPaid,
    notes: data.notes,
  };
}

async function templateBytes() {
  const response = await fetch(TEMPLATE_URL);
  if (!response.ok) throw new Error("Invoice template could not be loaded.");
  return new Uint8Array(await response.arrayBuffer());
}

export async function invoiceToPdfBlob(invoice: InvoiceData) {
  const bytes = await stampInvoiceTemplate(await templateBytes(), toTemplate(invoice));
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy], { type: "application/pdf" });
}

export async function downloadInvoicePDF(
  data: InvoiceData,
  filename = "invoice.pdf",
) {
  const blob = await invoiceToPdfBlob(data);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function openInvoicePdf(data: InvoiceData) {
  const blob = await invoiceToPdfBlob(data);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
}

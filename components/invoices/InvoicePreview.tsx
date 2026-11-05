"use client";

/**
 * On-screen invoice laid over the Skytech Ghana letterhead.
 * The PDF download stamps the same fields onto that letterhead file.
 */

import { formatCurrency } from "@/lib/utils";
import { INVOICE_PAGE } from "@/lib/crm/invoice-template";

export interface InvoiceLineItem {
  description: string;
  rate: number;
  qty: number;
  subLines?: string[];
}

export interface InvoiceData {
  issuerName: string;
  issuerTagline?: string;
  issuerEmail?: string;
  issuerPhone?: string;
  issuerAddress?: string;
  issuerTaxId?: string;
  paymentInstructions?: string;
  clientName: string;
  clientCompany: string;
  clientAddress: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  items: InvoiceLineItem[];
  taxRatePercent: number;
  discountAmount?: number;
  currencySymbol?: string;
  amountPaid?: number;
  notes?: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  signatureName?: string;
  signatureUrl?: string;
  logoUrl?: string;
}

export const defaultInvoice: InvoiceData = {
  issuerName: "Skytech Ghana",
  issuerEmail: "Sales@skytechghana.com",
  issuerPhone: "0538311626",
  issuerAddress: "Spintex Road, Dnor Plaza",
  clientName: "[CLIENT NAME]",
  clientCompany: "[CLIENT COMPANY]",
  clientAddress: "[CLIENT ADDRESS]",
  invoiceNo: "[INVOICE NO.]",
  date: "[DATE]",
  dueDate: "[DUE DATE]",
  items: [{ description: "[LINE ITEM DESCRIPTION]", rate: 0, qty: 1 }],
  taxRatePercent: 0,
  amountPaid: 0,
  bankName: "Merchant",
  accountName: "BRICSKY TECH",
  accountNumber: "3182364624",
  signatureName: "Daniel K. Agblo",
};

function qtyLabel(qty: number) {
  if (Number.isInteger(qty)) return String(qty);
  return String(Math.round(qty * 100) / 100);
}

export default function InvoicePreview({
  data = defaultInvoice,
}: {
  data?: InvoiceData;
}) {
  const items = Array.isArray(data?.items) ? data.items : [];
  const subtotal = items.reduce((sum, item) => sum + item.rate * item.qty, 0);
  const tax = subtotal * ((data.taxRatePercent ?? 0) / 100);
  const discount = data.discountAmount ?? 0;
  const total = Math.max(subtotal + tax - discount, 0);
  const paid = data.amountPaid ?? 0;
  const rows = items.length
    ? items
    : [{ description: "No line items yet", rate: 0, qty: 0 }];
  const box = {
    left: `${(INVOICE_PAGE.marginX / INVOICE_PAGE.width) * 100}%`,
    right: `${(INVOICE_PAGE.marginX / INVOICE_PAGE.width) * 100}%`,
    top: `${(INVOICE_PAGE.contentTop / INVOICE_PAGE.height) * 100}%`,
    bottom: `${(INVOICE_PAGE.contentBottom / INVOICE_PAGE.height) * 100}%`,
  };

  return (
    <div className="flex justify-center bg-neutral-100 p-3 md:p-5">
      <div
        className="relative w-full bg-white shadow-sm"
        style={{
          maxWidth: 720,
          aspectRatio: `${INVOICE_PAGE.width} / ${INVOICE_PAGE.height}`,
        }}
      >
        <img
          src="/assets/skytech-invoice-template.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
        <div
          className="absolute overflow-y-auto text-[10px] leading-snug text-neutral-900 md:text-[11px]"
          style={{ ...box, fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-bold tracking-wide">ISSUED TO:</p>
              <p className="mt-1 font-bold">{data.clientName || "Client"}</p>
              {data.clientCompany ? <p>{data.clientCompany}</p> : null}
              {data.clientAddress ? (
                <p className="whitespace-pre-line text-neutral-700">{data.clientAddress}</p>
              ) : null}
            </div>
            <div className="shrink-0 text-right">
              <p>
                <span className="font-bold">INVOICE NO:</span>{" "}
                <span className="font-bold">{data.invoiceNo}</span>
              </p>
              <p className="mt-1">
                <span className="font-bold">DATE:</span> {data.date}
              </p>
              <p className="mt-1">
                <span className="font-bold">DUE DATE:</span> {data.dueDate}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-[1fr_78px_40px_92px] border-b-2 border-neutral-900 pb-1 font-bold tracking-wide">
            <span>DESCRIPTION</span>
            <span>RATE</span>
            <span>QTY</span>
            <span className="text-right">TOTAL</span>
          </div>
          {rows.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_78px_40px_92px] border-b border-neutral-200 py-1.5 text-neutral-800"
            >
              <span className="pr-2">
                {item.description}
                {item.subLines?.filter((line) => line.trim()).map((line, subIndex) => (
                  <span key={subIndex} className="mt-0.5 block pl-2 text-neutral-500">
                    - {line}
                  </span>
                ))}
              </span>
              <span>{formatCurrency(item.rate)}</span>
              <span>{qtyLabel(item.qty)}</span>
              <span className="text-right">{formatCurrency(item.rate * item.qty)}</span>
            </div>
          ))}

          <div className="ml-auto mt-2 w-[220px] space-y-1">
            <div className="flex justify-between font-bold">
              <span>SUBTOTAL</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 ? (
              <div className="flex justify-between">
                <span>DISCOUNT</span>
                <span>- {formatCurrency(discount)}</span>
              </div>
            ) : null}
            {(data.taxRatePercent ?? 0) > 0 ? (
              <div className="flex justify-between">
                <span>TAX {data.taxRatePercent}%</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            ) : null}
            <div className="flex justify-between border-t-2 border-neutral-900 pt-1 font-bold">
              <span>TOTAL</span>
              <span>{formatCurrency(total)}</span>
            </div>
            {paid > 0 ? (
              <>
                <div className="flex justify-between">
                  <span>AMOUNT PAID</span>
                  <span>{formatCurrency(paid)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>BALANCE DUE</span>
                  <span>{formatCurrency(Math.max(total - paid, 0))}</span>
                </div>
              </>
            ) : null}
          </div>

          {data.notes?.trim() ? (
            <div className="mt-3">
              <p className="font-bold">NOTES</p>
              <p className="mt-1 whitespace-pre-line text-neutral-700">{data.notes}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import {
  InvoiceWorkspace,
  type InvoiceIssuerSettings,
} from "@/components/settings/invoices/InvoiceWorkspace";

export const metadata: Metadata = { title: "Invoices" };

const issuerInfo: InvoiceIssuerSettings = {
  name: process.env.INVOICE_ISSUER_NAME ?? "Skytech Ghana",
  email: process.env.INVOICE_ISSUER_EMAIL ?? "Sales@skytechghana.com",
  phone: process.env.INVOICE_ISSUER_PHONE ?? "0538311626",
  address: process.env.INVOICE_ISSUER_ADDRESS ?? "Spintex Road, Dnor Plaza",
  taxId: process.env.INVOICE_ISSUER_TAX_ID ?? "",
  paymentInstructions:
    process.env.INVOICE_PAYMENT_INSTRUCTIONS?.replace(/\\n/g, "\n") ??
    "Merchant No: 3182364624\nAccount Name: BRICSKY TECH",
};

export default function InvoicesPage() {
  return (
    <div>
      <InvoiceWorkspace issuerInfo={issuerInfo} />
    </div>
  );
}

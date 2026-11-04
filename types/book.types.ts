export type BookEntryType = "REVENUE" | "EXPENSE";
export type BookSource = "PIPELINE" | "MANUAL";
export type BookRecurrence = "WEEKLY" | "MONTHLY" | "YEARLY";

export const BOOK_CATEGORIES: Record<
  BookEntryType,
  Array<{ value: string; label: string }>
> = {
  REVENUE: [
    { value: "CLIENT_PAYMENT", label: "Client payment" },
    { value: "RETENTION", label: "Retention" },
    { value: "HOSTING", label: "Hosting" },
    { value: "DOMAIN", label: "Domain" },
    { value: "MAINTENANCE", label: "Maintenance" },
    { value: "OTHER_INCOME", label: "Other income" },
  ],
  EXPENSE: [
    { value: "SALARY", label: "Salaries" },
    { value: "PETTY_OFFICE", label: "Petty office expense" },
    { value: "RENT", label: "Rent" },
    { value: "UTILITIES", label: "Utilities" },
    { value: "INTERNET", label: "Internet & airtime" },
    { value: "MARKETING", label: "Marketing" },
    { value: "TRANSPORT", label: "Transport" },
    { value: "SUPPLIES", label: "Supplies" },
    { value: "OTHER_EXPENSE", label: "Other expense" },
  ],
};

export const BOOK_RECURRENCE: Array<{ value: BookRecurrence; label: string }> = [
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
];

export const BOOK_PAYMENT_MODES = [
  { value: "MOMO", label: "Mobile money" },
  { value: "BANK_TRANSFER", label: "Bank transfer" },
  { value: "CASH", label: "Cash" },
  { value: "CHEQUE", label: "Cheque" },
] as const;

export const RECURRING_CATEGORY_DEFAULTS = new Set([
  "SALARY",
  "PETTY_OFFICE",
  "RENT",
  "UTILITIES",
  "INTERNET",
  "HOSTING",
  "DOMAIN",
  "MAINTENANCE",
]);

export const categoryLabel = (category: string) =>
  [...BOOK_CATEGORIES.REVENUE, ...BOOK_CATEGORIES.EXPENSE].find(
    (item) => item.value === category,
  )?.label || category;

export const paymentModeLabel = (mode: string | null | undefined) => {
  if (!mode) return "";
  return BOOK_PAYMENT_MODES.find((item) => item.value === mode)?.label || mode;
};

export const recurrenceLabel = (recurrence: string | null | undefined) =>
  BOOK_RECURRENCE.find((item) => item.value === recurrence)?.label || "Monthly";

export interface BookEntry {
  id: string;
  entryType: BookEntryType;
  source: BookSource;
  sourceLogId: string | null;
  dealId: string | null;
  dealTitle: string | null;
  category: string;
  description: string;
  amount: number;
  currency: string;
  paymentMode: string | null;
  referenceNo: string | null;
  entryDate: string;
  isRecurring: boolean;
  recurrence: BookRecurrence | null;
  recurrenceParentId: string | null;
  isTemplate: boolean;
  notes: string | null;
  postedInRange?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookSummary {
  revenue: number;
  expenses: number;
  net: number;
  pipelineCollected: number;
  manualRevenue: number;
  recurringPosted: number;
  currency: string;
}

export interface BookCategoryTotal {
  category: string;
  entryType: BookEntryType;
  total: number;
}

export interface BooksSnapshot {
  entries: BookEntry[];
  templates: BookEntry[];
  summary: BookSummary;
  categoryTotals: BookCategoryTotal[];
  range: { from: string; to: string };
  imported: number;
}

export interface BookFilters {
  from?: string;
  to?: string;
  type?: BookEntryType | "";
  source?: BookSource | "";
  search?: string;
}

export interface SaveBookEntryRequest {
  entryType: BookEntryType;
  category: string;
  amount: number;
  entryDate: string;
  paymentMode?: string | null;
  referenceNo?: string | null;
  description: string;
  notes?: string | null;
  isRecurring?: boolean;
  recurrence?: BookRecurrence | null;
  scheduleOnly?: boolean;
}

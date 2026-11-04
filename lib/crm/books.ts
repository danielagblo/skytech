import { crmExecute, crmQuery, getCrmPool, MysqlRow, newId } from "@/lib/crm/db";
import { parseCurrencyAmount } from "@/lib/crm/formatters";
import {
  BOOK_CATEGORIES,
  BOOK_PAYMENT_MODES,
  categoryLabel,
  paymentModeLabel,
  type BookEntry,
  type BookEntryType,
  type BookRecurrence,
  type BooksSnapshot,
  type SaveBookEntryRequest,
} from "@/types/book.types";

export class BookError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const isIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const asDateOnly = (value: unknown) => {
  if (!value) return "";
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
};

const asIso = (value: unknown) => {
  if (value instanceof Date) return value.toISOString();
  if (!value) return new Date().toISOString();
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString();
};

const cleanText = (value: unknown, max: number) =>
  String(value ?? "").trim().slice(0, max);

const monthEnd = (isoDate: string) => {
  const [year, month] = isoDate.split("-").map(Number);
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${isoDate.slice(0, 8)}${String(last).padStart(2, "0")}`;
};

export function resolveBookRange(from: string | null, to: string | null) {
  if (from && to && isIsoDate(from) && isIsoDate(to) && from <= to) {
    return { from, to };
  }
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return { from: `${month}-01`, to: monthEnd(`${month}-01`) };
}

const formatEntry = (row: MysqlRow): BookEntry => ({
  id: String(row.id),
  entryType: row.entry_type === "EXPENSE" ? "EXPENSE" : "REVENUE",
  source: row.source === "PIPELINE" ? "PIPELINE" : "MANUAL",
  sourceLogId: row.source_log_id ? String(row.source_log_id) : null,
  dealId: row.deal_id ? String(row.deal_id) : null,
  dealTitle: row.deal_title ? String(row.deal_title) : null,
  category: String(row.category || ""),
  description: String(row.description || ""),
  amount: roundMoney(Number(row.amount || 0)),
  currency: row.currency ? String(row.currency) : "GHS",
  paymentMode: row.payment_mode ? String(row.payment_mode) : null,
  referenceNo: row.reference_no ? String(row.reference_no) : null,
  entryDate: asDateOnly(row.entry_date_text || row.entry_date),
  isRecurring: Number(row.is_recurring) === 1,
  recurrence:
    row.recurrence === "WEEKLY" ||
    row.recurrence === "MONTHLY" ||
    row.recurrence === "YEARLY"
      ? row.recurrence
      : null,
  recurrenceParentId: row.recurrence_parent_id
    ? String(row.recurrence_parent_id)
    : null,
  isTemplate: Number(row.is_template) === 1,
  notes: row.notes ? String(row.notes) : null,
  postedInRange:
    row.posted_in_range === undefined
      ? undefined
      : Number(row.posted_in_range) === 1,
  createdAt: asIso(row.created_at),
  updatedAt: asIso(row.updated_at),
});

const PAYMENT_IMPORT = `
  INSERT IGNORE INTO book_entries (
    id, company_id, entry_type, source, source_log_id, deal_id,
    category, description, amount, currency, payment_mode, reference_no,
    entry_date, is_recurring, recurrence, recurrence_parent_id, is_template,
    notes, created_by
  )
  SELECT
    UUID(),
    dl.company_id,
    'REVENUE',
    'PIPELINE',
    dl.id,
    dl.deal_id,
    'CLIENT_PAYMENT',
    LEFT(CONCAT('Pipeline payment · ', COALESCE(NULLIF(d.title, ''), 'Deal')), 255),
    dl.amount_paid,
    COALESCE(NULLIF(d.currency, ''), 'GHS'),
    NULLIF(dl.payment_mode, ''),
    COALESCE(NULLIF(dl.receipt_number, ''), NULLIF(dl.invoice_number, '')),
    COALESCE(DATE(dl.created_at), CURDATE()),
    0, NULL, NULL, 0,
    NULLIF(LEFT(COALESCE(dl.body, ''), 2000), ''),
    dl.created_by
  FROM deal_logs dl
  INNER JOIN deals d ON d.id = dl.deal_id AND d.deleted_at IS NULL
  WHERE dl.log_type = 'PAYMENT'
    AND dl.amount_paid IS NOT NULL
    AND dl.amount_paid > 0
`;

const INVOICE_PAYMENT_IMPORT = `
  INSERT IGNORE INTO book_entries (
    id, company_id, entry_type, source, source_log_id, deal_id,
    category, description, amount, currency, payment_mode, reference_no,
    entry_date, is_recurring, recurrence, recurrence_parent_id, is_template,
    notes, created_by
  )
  SELECT
    UUID(),
    ip.company_id,
    'REVENUE',
    'PIPELINE',
    CONCAT('invoice-payment:', ip.id),
    inv.deal_id,
    'CLIENT_PAYMENT',
    LEFT(CONCAT('Invoice payment · ', COALESCE(NULLIF(inv.invoice_number, ''), 'Invoice')), 255),
    ip.amount,
    COALESCE(NULLIF(inv.currency, ''), 'GHS'),
    NULLIF(ip.payment_mode, ''),
    NULLIF(ip.reference, ''),
    COALESCE(DATE(ip.paid_at), DATE(ip.created_at), CURDATE()),
    0, NULL, NULL, 0,
    'Payment received against an invoice.',
    ip.recorded_by
  FROM invoice_payments ip
  INNER JOIN invoices inv ON inv.id = ip.invoice_id
  WHERE ip.amount IS NOT NULL AND ip.amount > 0
`;

const DROP_UNPAID_PIPELINE_REVENUE = `
  UPDATE book_entries
  SET deleted_at = NOW()
  WHERE source = 'PIPELINE'
    AND entry_type = 'REVENUE'
    AND deleted_at IS NULL
    AND (
      category = 'RETENTION'
      OR source_log_id LIKE '%:retention'
      OR (
        source_log_id NOT LIKE 'invoice-payment:%'
        AND source_log_id NOT IN (
          SELECT id FROM deal_logs
          WHERE log_type = 'PAYMENT'
            AND amount_paid IS NOT NULL
            AND amount_paid > 0
        )
      )
    )
`;

export async function syncPipelinePayments() {
  const pool = await getCrmPool();
  await pool.query(DROP_UNPAID_PIPELINE_REVENUE);
  const [payments] = await pool.query(PAYMENT_IMPORT);
  const [invoicePayments] = await pool.query(INVOICE_PAYMENT_IMPORT);
  return (
    Number((payments as { affectedRows?: number }).affectedRows || 0) +
    Number((invoicePayments as { affectedRows?: number }).affectedRows || 0)
  );
}

async function getRaw(id: string) {
  const rows = await crmQuery<MysqlRow>(
    "SELECT * FROM book_entries WHERE id = ? AND deleted_at IS NULL LIMIT 1",
    [id],
  );
  return rows[0] || null;
}

async function getBookEntry(id: string) {
  const rows = await crmQuery<MysqlRow>(
    `SELECT be.*, DATE_FORMAT(be.entry_date, '%Y-%m-%d') AS entry_date_text, d.title AS deal_title
     FROM book_entries be
     LEFT JOIN deals d ON d.id = be.deal_id
     WHERE be.id = ? AND be.deleted_at IS NULL
     LIMIT 1`,
    [id],
  );
  return rows[0] ? formatEntry(rows[0]) : null;
}

const parseSave = (
  input: SaveBookEntryRequest,
  options: { allowRecurring: boolean; forceRevenue?: boolean },
) => {
  const entryType: BookEntryType = options.forceRevenue
    ? "REVENUE"
    : input.entryType;
  if (entryType !== "REVENUE" && entryType !== "EXPENSE") {
    throw new BookError("Choose revenue or an expense.");
  }
  const categories = BOOK_CATEGORIES[entryType];
  const category = String(input.category || "");
  if (!categories.some((item) => item.value === category)) {
    throw new BookError("Choose a category.");
  }
  const amount = roundMoney(parseCurrencyAmount(input.amount));
  if (!(amount > 0)) throw new BookError("Enter an amount greater than zero.");
  const entryDate = String(input.entryDate || "");
  if (!isIsoDate(entryDate)) throw new BookError("Choose a valid date.");
  const description = cleanText(input.description, 255);
  if (!description) throw new BookError("Add a short description.");
  const paymentMode = cleanText(input.paymentMode, 50);
  if (
    paymentMode &&
    !BOOK_PAYMENT_MODES.some((item) => item.value === paymentMode)
  ) {
    throw new BookError("Choose a valid payment mode.");
  }
  const recurrence = String(input.recurrence || "MONTHLY");
  const isRecurring = options.allowRecurring && Boolean(input.isRecurring);
  if (
    isRecurring &&
    recurrence !== "WEEKLY" &&
    recurrence !== "MONTHLY" &&
    recurrence !== "YEARLY"
  ) {
    throw new BookError("Choose how often this repeats.");
  }
  return {
    entryType,
    category,
    amount,
    entryDate,
    paymentMode: paymentMode || null,
    referenceNo: cleanText(input.referenceNo, 100) || null,
    description,
    notes: cleanText(input.notes, 4000) || null,
    isRecurring,
    recurrence: (isRecurring ? recurrence : null) as BookRecurrence | null,
    scheduleOnly: Boolean(input.scheduleOnly),
  };
};

const insertEntry = async (values: {
  id: string;
  companyId: string | null;
  userId: string;
  source: "MANUAL";
  parentId: string | null;
  isTemplate: boolean;
  parsed: ReturnType<typeof parseSave>;
}) => {
  const { parsed } = values;
  await crmExecute(
    `INSERT INTO book_entries (
      id, company_id, entry_type, source, source_log_id, deal_id,
      category, description, amount, currency, payment_mode, reference_no,
      entry_date, is_recurring, recurrence, recurrence_parent_id, is_template,
      notes, created_by
    ) VALUES (?, ?, ?, ?, NULL, NULL, ?, ?, ?, 'GHS', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      values.id,
      values.companyId,
      parsed.entryType,
      values.source,
      parsed.category,
      parsed.description,
      parsed.amount,
      parsed.paymentMode,
      parsed.referenceNo,
      parsed.entryDate,
      values.isTemplate ? 1 : 0,
      values.isTemplate ? parsed.recurrence : null,
      values.parentId,
      values.isTemplate ? 1 : 0,
      parsed.notes,
      values.userId,
    ],
  );
};

const matchesSearch = (entry: BookEntry, search: string) => {
  const haystack = [
    entry.description,
    entry.referenceNo,
    entry.dealTitle,
    entry.notes,
    categoryLabel(entry.category),
    paymentModeLabel(entry.paymentMode),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(search.toLowerCase());
};

export async function loadBooks(
  range: { from: string; to: string },
  filters: { type?: string; source?: string; search?: string },
): Promise<BooksSnapshot> {
  const imported = await syncPipelinePayments();
  const rows = await crmQuery<MysqlRow>(
    `SELECT be.*, DATE_FORMAT(be.entry_date, '%Y-%m-%d') AS entry_date_text, d.title AS deal_title
     FROM book_entries be
     LEFT JOIN deals d ON d.id = be.deal_id
     WHERE be.deleted_at IS NULL
       AND be.is_template = 0
       AND be.entry_date BETWEEN ? AND ?
     ORDER BY be.entry_date DESC, be.created_at DESC`,
    [range.from, range.to],
  );
  const templateRows = await crmQuery<MysqlRow>(
    `SELECT be.*, DATE_FORMAT(be.entry_date, '%Y-%m-%d') AS entry_date_text, d.title AS deal_title,
       EXISTS(
         SELECT 1 FROM book_entries child
         WHERE child.recurrence_parent_id = be.id
           AND child.deleted_at IS NULL
           AND child.is_template = 0
           AND child.entry_date BETWEEN ? AND ?
       ) AS posted_in_range
     FROM book_entries be
     LEFT JOIN deals d ON d.id = be.deal_id
     WHERE be.deleted_at IS NULL AND be.is_template = 1
     ORDER BY be.entry_type ASC, be.category ASC, be.description ASC`,
    [range.from, range.to],
  );

  const periodEntries = rows.map(formatEntry);
  const summary = periodEntries.reduce(
    (totals, entry) => {
      if (entry.entryType === "REVENUE") {
        totals.revenue += entry.amount;
        if (entry.source === "PIPELINE") totals.pipelineCollected += entry.amount;
        else totals.manualRevenue += entry.amount;
      } else {
        totals.expenses += entry.amount;
        if (entry.recurrenceParentId) totals.recurringPosted += entry.amount;
      }
      return totals;
    },
    {
      revenue: 0,
      expenses: 0,
      pipelineCollected: 0,
      manualRevenue: 0,
      recurringPosted: 0,
    },
  );

  const categoryMap = new Map<
    string,
    { category: string; entryType: BookEntryType; total: number }
  >();
  for (const entry of periodEntries) {
    const key = `${entry.entryType}:${entry.category}`;
    const current = categoryMap.get(key) || {
      category: entry.category,
      entryType: entry.entryType,
      total: 0,
    };
    current.total += entry.amount;
    categoryMap.set(key, current);
  }

  const search = filters.search?.trim() || "";
  const entries = periodEntries.filter((entry) => {
    if (filters.type === "REVENUE" || filters.type === "EXPENSE") {
      if (entry.entryType !== filters.type) return false;
    }
    if (filters.source === "PIPELINE" || filters.source === "MANUAL") {
      if (entry.source !== filters.source) return false;
    }
    if (search && !matchesSearch(entry, search)) return false;
    return true;
  });

  return {
    entries,
    templates: templateRows.map(formatEntry),
    summary: {
      revenue: roundMoney(summary.revenue),
      expenses: roundMoney(summary.expenses),
      net: roundMoney(summary.revenue - summary.expenses),
      pipelineCollected: roundMoney(summary.pipelineCollected),
      manualRevenue: roundMoney(summary.manualRevenue),
      recurringPosted: roundMoney(summary.recurringPosted),
      currency: "GHS",
    },
    categoryTotals: Array.from(categoryMap.values())
      .map((item) => ({ ...item, total: roundMoney(item.total) }))
      .sort((a, b) => b.total - a.total),
    range,
    imported,
  };
}

export async function createBookEntry(
  user: { id: string; companyId?: string | null },
  input: SaveBookEntryRequest,
) {
  const parsed = parseSave(input, { allowRecurring: true });
  const companyId = user.companyId || null;
  if (parsed.isRecurring) {
    const templateId = newId();
    await insertEntry({
      id: templateId,
      companyId,
      userId: user.id,
      source: "MANUAL",
      parentId: null,
      isTemplate: true,
      parsed,
    });
    if (parsed.scheduleOnly) {
      const template = await getBookEntry(templateId);
      if (!template) throw new BookError("The schedule could not be saved.", 500);
      return template;
    }
    const entryId = newId();
    await insertEntry({
      id: entryId,
      companyId,
      userId: user.id,
      source: "MANUAL",
      parentId: templateId,
      isTemplate: false,
      parsed: { ...parsed, isRecurring: false, recurrence: null },
    });
    const entry = await getBookEntry(entryId);
    if (!entry) throw new BookError("The entry could not be saved.", 500);
    return entry;
  }

  const entryId = newId();
  await insertEntry({
    id: entryId,
    companyId,
    userId: user.id,
    source: "MANUAL",
    parentId: null,
    isTemplate: false,
    parsed,
  });
  const entry = await getBookEntry(entryId);
  if (!entry) throw new BookError("The entry could not be saved.", 500);
  return entry;
}

export async function updateBookEntry(id: string, input: SaveBookEntryRequest) {
  const existing = await getRaw(id);
  if (!existing) throw new BookError("That book entry was not found.", 404);
  const isTemplate = Number(existing.is_template) === 1;
  const isPipeline = existing.source === "PIPELINE";
  const parsed = parseSave(input, {
    allowRecurring: isTemplate,
    forceRevenue: isPipeline,
  });
  const keepTemplate = isTemplate && parsed.isRecurring && !isPipeline;
  await crmExecute(
    `UPDATE book_entries SET
      entry_type = ?,
      category = ?,
      description = ?,
      amount = ?,
      payment_mode = ?,
      reference_no = ?,
      entry_date = ?,
      notes = ?,
      is_recurring = ?,
      recurrence = ?,
      is_template = ?,
      updated_at = NOW()
     WHERE id = ? AND deleted_at IS NULL`,
    [
      parsed.entryType,
      parsed.category,
      parsed.description,
      parsed.amount,
      parsed.paymentMode,
      parsed.referenceNo,
      parsed.entryDate,
      parsed.notes,
      keepTemplate ? 1 : 0,
      keepTemplate ? parsed.recurrence : null,
      keepTemplate ? 1 : 0,
      id,
    ],
  );
  const entry = await getBookEntry(id);
  if (!entry) throw new BookError("That book entry was not found.", 404);
  return entry;
}

export async function deleteBookEntry(id: string) {
  const result = await crmExecute(
    "UPDATE book_entries SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
    [id],
  );
  if (!Number(result?.affectedRows || 0)) {
    throw new BookError("That book entry was not found.", 404);
  }
}

export async function postRecurringEntry(
  user: { id: string },
  id: string,
  entryDate: string,
) {
  if (!isIsoDate(entryDate)) throw new BookError("Choose a valid date.");
  const existing = await getRaw(id);
  if (!existing || Number(existing.is_template) !== 1) {
    throw new BookError("Choose a recurring schedule to post.", 400);
  }
  let start = `${entryDate.slice(0, 8)}01`;
  let end = monthEnd(entryDate);
  if (existing.recurrence === "WEEKLY") {
    const [year, month, day] = entryDate.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const weekday = date.getUTCDay();
    const mondayOffset = weekday === 0 ? 6 : weekday - 1;
    date.setUTCDate(date.getUTCDate() - mondayOffset);
    start = date.toISOString().slice(0, 10);
    date.setUTCDate(date.getUTCDate() + 6);
    end = date.toISOString().slice(0, 10);
  }
  const duplicates = await crmQuery<MysqlRow>(
    `SELECT id FROM book_entries
     WHERE recurrence_parent_id = ?
       AND deleted_at IS NULL
       AND is_template = 0
       AND entry_date BETWEEN ? AND ?
     LIMIT 1`,
    [id, start, end],
  );
  if (duplicates.length) {
    throw new BookError(
      existing.recurrence === "WEEKLY"
        ? "This schedule is already posted for that week."
        : "This schedule is already posted for that month.",
      409,
    );
  }
  const entryId = newId();
  await crmExecute(
    `INSERT INTO book_entries (
      id, company_id, entry_type, source, source_log_id, deal_id,
      category, description, amount, currency, payment_mode, reference_no,
      entry_date, is_recurring, recurrence, recurrence_parent_id, is_template,
      notes, created_by
    ) VALUES (?, ?, ?, 'MANUAL', NULL, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?, 0, ?, ?)`,
    [
      entryId,
      existing.company_id || null,
      existing.entry_type,
      existing.deal_id || null,
      existing.category,
      existing.description,
      existing.amount,
      existing.currency || "GHS",
      existing.payment_mode || null,
      existing.reference_no || null,
      entryDate,
      id,
      existing.notes || null,
      user.id,
    ],
  );
  const entry = await getBookEntry(entryId);
  if (!entry) throw new BookError("The entry could not be posted.", 500);
  return entry;
}

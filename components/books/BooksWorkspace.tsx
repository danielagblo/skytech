"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertCircle, Pencil, Plus, RefreshCw, ShieldAlert, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { BookEntryDialog, type BookDraft } from "@/components/books/BookEntryDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useBooks,
  useDeleteBookEntry,
  usePostRecurringEntry,
} from "@/hooks/useBooks";
import { cn } from "@/lib/utils";
import {
  categoryLabel,
  paymentModeLabel,
  recurrenceLabel,
  type BookEntry,
  type BookEntryType,
  type BookSource,
} from "@/types/book.types";

const controlClass =
  "h-10 rounded-lg border border-input bg-background px-3 text-sm";

const currentMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const todayInput = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const monthBounds = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);
  const last = new Date(year, monthNumber, 0).getDate();
  const padded = String(monthNumber).padStart(2, "0");
  return {
    from: `${year}-${padded}-01`,
    to: `${year}-${padded}-${String(last).padStart(2, "0")}`,
  };
};

const monthTitle = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber - 1, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
};

const prettyDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const money = (amount: number, currency = "GHS") =>
  `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Stat = ({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "good" | "bad";
}) => (
  <section className="border bg-card px-4 py-3">
    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {label}
    </p>
    <p
      className={cn(
        "mt-1 text-xl font-semibold tracking-tight",
        tone === "good" && "text-emerald-700",
        tone === "bad" && "text-rose-700",
      )}
    >
      {value}
    </p>
    <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
  </section>
);

export const BooksWorkspace = () => {
  const pathname = usePathname();
  const root = pathname.startsWith("/crm") ? "/crm" : "";
  const hydrated = useAuthStore((state) => state.hydrated);
  const user = useAuthStore((state) => state.user);
  const allowed = user?.role === "ADMIN" || user?.booksAccess === true;
  const [month, setMonth] = useState(currentMonth);
  const [type, setType] = useState<"" | BookEntryType>("");
  const [source, setSource] = useState<"" | BookSource>("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BookEntry | null>(null);
  const [draft, setDraft] = useState<BookDraft | null>(null);
  const range = monthBounds(month);
  const books = useBooks(range, hydrated && allowed);
  const remove = useDeleteBookEntry();
  const post = usePostRecurringEntry();
  const seenImport = useRef("");
  const data = books.data;

  useEffect(() => {
    if (!data?.imported) return;
    const key = `${data.range.from}:${data.range.to}:${data.imported}`;
    if (seenImport.current === key) return;
    seenImport.current = key;
    toast.success(
      data.imported === 1
        ? "Collected 1 pipeline payment into the books."
        : `Collected ${data.imported} pipeline payments into the books.`,
    );
  }, [data]);

  const filtered = useMemo(() => {
    const entries = data?.entries ?? [];
    const query = search.trim().toLowerCase();
    return entries.filter((entry) => {
      if (type && entry.entryType !== type) return false;
      if (source && entry.source !== source) return false;
      if (!query) return true;
      return [
        entry.description,
        entry.referenceNo,
        entry.dealTitle,
        entry.notes,
        categoryLabel(entry.category),
        paymentModeLabel(entry.paymentMode),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [data?.entries, search, source, type]);

  const openCreate = (next: BookDraft | null = null) => {
    setEditing(null);
    setDraft(next);
    setDialogOpen(true);
  };

  const openEdit = (entry: BookEntry) => {
    setDraft(null);
    setEditing(entry);
    setDialogOpen(true);
  };

  const onDelete = (entry: BookEntry) => {
    const message = entry.isTemplate
      ? "Remove this recurring schedule? Months already posted stay in the ledger."
      : entry.source === "PIPELINE"
        ? "Remove this pipeline payment from the books? It will not be collected again."
        : "Remove this entry from the books?";
    if (!window.confirm(message)) return;
    remove.mutate(entry.id);
  };

  const postDate = todayInput().startsWith(month) ? todayInput() : range.from;
  const summary = data?.summary;
  const currency = summary?.currency || "GHS";
  const revenueTotals =
    data?.categoryTotals.filter((item) => item.entryType === "REVENUE") ?? [];
  const expenseTotals =
    data?.categoryTotals.filter((item) => item.entryType === "EXPENSE") ?? [];

  if (!hydrated) {
    return (
      <div className="space-y-4">
        <PageHeader title="Books" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Books"
          description="Revenue, expenses, and pipeline collections."
        />
        <EmptyState
          icon={ShieldAlert}
          title="Books is not assigned to you"
          message="An administrator can assign or remove this page for your account."
          action={
            <Link href={`${root}/home`} className={buttonVariants()}>
              Return home
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Books"
        description="Collect pipeline payments, record other income, and track salaries, petty office costs, and the rest of the month."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => books.refetch()}
              disabled={books.isFetching}
            >
              <RefreshCw className={cn(books.isFetching && "animate-spin")} />
              Refresh
            </Button>
            <Button type="button" onClick={() => openCreate()}>
              <Plus />
              Record entry
            </Button>
          </>
        }
      />

      {books.isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-96" />
        </div>
      ) : books.isError || !data || !summary ? (
        <EmptyState
          icon={AlertCircle}
          title="Books could not be loaded"
          message="Check your connection and refresh this page. Pipeline records are not changed."
          action={
            <Button type="button" variant="outline" onClick={() => books.refetch()}>
              Try again
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Stat
              label="Revenue"
              value={money(summary.revenue, currency)}
              hint={`${monthTitle(month)} income`}
              tone="good"
            />
            <Stat
              label="Expenses"
              value={money(summary.expenses, currency)}
              hint={
                summary.recurringPosted
                  ? `${money(summary.recurringPosted, currency)} from schedules`
                  : "Costs recorded this month"
              }
              tone="bad"
            />
            <Stat
              label="Net"
              value={money(summary.net, currency)}
              hint="Revenue minus expenses"
              tone={summary.net >= 0 ? "good" : "bad"}
            />
            <Link href={`${root}/pipeline`} className="block">
              <Stat
                label="Still to collect"
                value={money(summary.outstandingArrears, currency)}
                hint="Open arrears on deals"
              />
            </Link>
          </div>

          <section className="border bg-card">
            <div className="flex h-9 items-center bg-muted px-5 text-sm font-medium">
              Revenue mobilisation
            </div>
            <div className="grid gap-4 px-5 py-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Collected from pipeline</p>
                <p className="text-sm font-medium">
                  {money(summary.pipelineCollected, currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Recorded manually</p>
                <p className="text-sm font-medium">
                  {money(summary.manualRevenue, currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Left on deals</p>
                <p className="text-sm font-medium">
                  {money(summary.outstandingArrears, currency)}
                </p>
              </div>
            </div>
            {(revenueTotals.length > 0 || expenseTotals.length > 0) && (
              <div className="grid gap-4 border-t px-5 py-4 sm:grid-cols-2">
                <CategoryList title="Income by category" items={revenueTotals} currency={currency} />
                <CategoryList title="Costs by category" items={expenseTotals} currency={currency} />
              </div>
            )}
          </section>

          <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section className="min-w-0 border bg-card">
              <div className="flex flex-col gap-3 border-b px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-sm font-medium">Ledger · {monthTitle(month)}</h2>
                  <p className="text-xs text-muted-foreground">
                    Showing {filtered.length} of {data.entries.length} records
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <input
                    type="month"
                    aria-label="Month"
                    className={controlClass}
                    value={month}
                    onChange={(event) => {
                      if (/^\d{4}-\d{2}$/.test(event.target.value)) {
                        setMonth(event.target.value);
                      }
                    }}
                  />
                  <select
                    aria-label="Record type"
                    className={controlClass}
                    value={type}
                    onChange={(event) =>
                      setType(event.target.value as "" | BookEntryType)
                    }
                  >
                    <option value="">All records</option>
                    <option value="REVENUE">Revenue</option>
                    <option value="EXPENSE">Expenses</option>
                  </select>
                  <select
                    aria-label="Source"
                    className={controlClass}
                    value={source}
                    onChange={(event) =>
                      setSource(event.target.value as "" | BookSource)
                    }
                  >
                    <option value="">All sources</option>
                    <option value="PIPELINE">Pipeline</option>
                    <option value="MANUAL">Manual</option>
                  </select>
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search records"
                    aria-label="Search records"
                    className="sm:w-48"
                  />
                </div>
              </div>
              {filtered.length === 0 ? (
                <div className="p-4">
                  <EmptyState
                    icon={Wallet}
                    title={data.entries.length === 0 ? "No records this month" : "Nothing matches"}
                    message={
                      data.entries.length === 0
                        ? "Pipeline payments land here automatically. Record salaries, petty office expenses, and any other income by hand."
                        : "Try another month, type, or search."
                    }
                    action={
                      data.entries.length === 0 ? (
                        <Button type="button" onClick={() => openCreate()}>
                          <Plus />
                          Record entry
                        </Button>
                      ) : undefined
                    }
                  />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Record</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-24">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {prettyDate(entry.entryDate)}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{entry.description}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {[
                              categoryLabel(entry.category),
                              paymentModeLabel(entry.paymentMode),
                              entry.referenceNo,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <Badge
                              className={
                                entry.entryType === "REVENUE"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }
                            >
                              {entry.entryType === "REVENUE" ? "Revenue" : "Expense"}
                            </Badge>
                            <Badge className="bg-muted text-muted-foreground">
                              {entry.source === "PIPELINE" ? "Pipeline" : "Manual"}
                            </Badge>
                            {entry.recurrenceParentId && (
                              <Badge className="bg-amber-50 text-amber-800">
                                Recurring
                              </Badge>
                            )}
                            {entry.dealId && (
                              <Link
                                href={`${root}/pipeline/${entry.dealId}`}
                                className="text-xs text-primary underline-offset-2 hover:underline"
                              >
                                {entry.dealTitle || "Open deal"}
                              </Link>
                            )}
                          </div>
                          {entry.notes && (
                            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                              {entry.notes}
                            </p>
                          )}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "whitespace-nowrap text-right font-medium",
                            entry.entryType === "REVENUE"
                              ? "text-emerald-700"
                              : "text-rose-700",
                          )}
                        >
                          {entry.entryType === "EXPENSE" ? "−" : "+"}
                          {money(entry.amount, entry.currency)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Edit ${entry.description}`}
                              onClick={() => openEdit(entry)}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Remove ${entry.description}`}
                              onClick={() => onDelete(entry)}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </section>

            <aside className="border bg-card">
              <div className="flex h-9 items-center justify-between bg-muted px-4">
                <h2 className="text-sm font-medium">Recurring</h2>
                <button
                  type="button"
                  className="text-xs font-medium text-primary"
                  onClick={() =>
                    openCreate({
                      entryType: "EXPENSE",
                      category: "SALARY",
                      isRecurring: true,
                      recurrence: "MONTHLY",
                    })
                  }
                >
                  Add schedule
                </button>
              </div>
              {data.templates.length === 0 ? (
                <p className="px-4 py-5 text-sm text-muted-foreground">
                  Keep salaries, petty office expenses, rent, and hosting here.
                  Post each one into the month when the money moves.
                </p>
              ) : (
                <ul>
                  {data.templates.map((entry) => {
                    const postedThisMonth = Boolean(entry.postedInRange);
                    const blockAnother =
                      entry.recurrence !== "WEEKLY" && postedThisMonth;
                    return (
                      <li key={entry.id} className="border-b px-4 py-3 last:border-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">{entry.description}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {categoryLabel(entry.category)} ·{" "}
                              {recurrenceLabel(entry.recurrence)} ·{" "}
                              {money(entry.amount, entry.currency)}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "shrink-0 text-[11px] font-medium",
                              postedThisMonth ? "text-emerald-700" : "text-amber-700",
                            )}
                          >
                            {postedThisMonth ? "Posted" : "Not posted"}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={blockAnother || post.isPending}
                            onClick={() =>
                              post.mutate({ id: entry.id, entryDate: postDate })
                            }
                          >
                            {entry.recurrence === "WEEKLY"
                              ? "Add this week"
                              : "Add to this month"}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => openEdit(entry)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete(entry)}
                          >
                            Remove
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </aside>
          </div>
        </>
      )}

      <BookEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editing}
        draft={draft}
      />
    </div>
  );
};

const Badge = ({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) => (
  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", className)}>
    {children}
  </span>
);

const CategoryList = ({
  title,
  items,
  currency,
}: {
  title: string;
  items: Array<{ category: string; total: number }>;
  currency: string;
}) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {title}
    </p>
    {items.length === 0 ? (
      <p className="mt-2 text-sm text-muted-foreground">None this month</p>
    ) : (
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item.category} className="flex items-center justify-between gap-3 text-sm">
            <span>{categoryLabel(item.category)}</span>
            <span className="font-medium">{money(item.total, currency)}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

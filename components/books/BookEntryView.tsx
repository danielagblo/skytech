"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  categoryLabel,
  paymentModeLabel,
  recurrenceLabel,
  type BookEntry,
} from "@/types/book.types";

const money = (amount: number, currency = "GHS") =>
  `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const prettyDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso || "—";
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-0.5 text-sm font-medium">{value}</p>
  </div>
);

export const BookEntryView = ({
  entry,
  open,
  onOpenChange,
  dealHref,
}: {
  entry: BookEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealHref?: string | null;
}) => {
  if (!entry) return null;
  const client = [
    entry.clientName,
    entry.clientRole,
    entry.clientCompany,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{entry.description}</DialogTitle>
          <DialogDescription>
            {entry.entryType === "REVENUE" ? "Payment received" : "Expense recorded"}{" "}
            on {prettyDate(entry.entryDate)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <p
            className={`text-2xl font-semibold ${entry.entryType === "REVENUE" ? "text-emerald-700" : "text-rose-700"}`}
          >
            {entry.entryType === "EXPENSE" ? "−" : "+"}
            {money(entry.amount, entry.currency)}
          </p>
          <section className="grid gap-3 sm:grid-cols-2">
            <Detail label="Category" value={categoryLabel(entry.category)} />
            <Detail
              label="Source"
              value={entry.source === "PIPELINE" ? "Pipeline" : "Manual entry"}
            />
            <Detail
              label="Payment mode"
              value={paymentModeLabel(entry.paymentMode) || "Not recorded"}
            />
            <Detail label="Reference" value={entry.referenceNo || "Not recorded"} />
            {entry.isRecurring && (
              <Detail
                label="Schedule"
                value={recurrenceLabel(entry.recurrence)}
              />
            )}
          </section>
          <section className="rounded-xl border p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Recorded by
            </p>
            <p className="mt-2 text-sm font-medium">
              {entry.recordedByName || "Unknown user"}
            </p>
            <p className="text-sm text-muted-foreground">
              {[entry.recordedByRole, entry.recordedByEmail]
                .filter(Boolean)
                .join(" · ") || "No account details stored"}
            </p>
          </section>
          <section className="rounded-xl border p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Client
            </p>
            {client || entry.clientEmail || entry.clientPhone || entry.dealTitle ? (
              <div className="mt-2 space-y-1 text-sm">
                <p className="font-medium">{client || "Client name not linked"}</p>
                {entry.clientPhone && <p>{entry.clientPhone}</p>}
                {entry.clientEmail && <p>{entry.clientEmail}</p>}
                {entry.dealTitle && (
                  <p className="text-muted-foreground">Deal · {entry.dealTitle}</p>
                )}
                {dealHref && (
                  <Link
                    href={dealHref}
                    className="inline-block text-primary underline-offset-2 hover:underline"
                  >
                    Open deal
                  </Link>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                No client is linked to this record.
              </p>
            )}
          </section>
          {entry.notes && (
            <section>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Notes
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm">{entry.notes}</p>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

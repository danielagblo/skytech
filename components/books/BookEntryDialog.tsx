"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBookEntry, useUpdateBookEntry } from "@/hooks/useBooks";
import {
  BOOK_CATEGORIES,
  BOOK_PAYMENT_MODES,
  BOOK_RECURRENCE,
  RECURRING_CATEGORY_DEFAULTS,
  type BookEntry,
  type BookEntryType,
  type BookRecurrence,
  type SaveBookEntryRequest,
} from "@/types/book.types";
import { toast } from "sonner";

const controlClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm";

export interface BookDraft {
  entryType?: BookEntryType;
  category?: string;
  description?: string;
  isRecurring?: boolean;
  recurrence?: BookRecurrence;
}

interface FormState {
  entryType: BookEntryType;
  category: string;
  amount: string;
  entryDate: string;
  paymentMode: string;
  referenceNo: string;
  description: string;
  notes: string;
  isRecurring: boolean;
  recurrence: BookRecurrence;
  scheduleOnly: boolean;
}

const todayInput = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const blankForm = (): FormState => ({
  entryType: "REVENUE",
  category: "CLIENT_PAYMENT",
  amount: "",
  entryDate: todayInput(),
  paymentMode: "MOMO",
  referenceNo: "",
  description: "",
  notes: "",
  isRecurring: false,
  recurrence: "MONTHLY",
  scheduleOnly: false,
});

const formFromEntry = (entry: BookEntry): FormState => ({
  entryType: entry.entryType,
  category: entry.category,
  amount: String(entry.amount),
  entryDate: entry.entryDate || todayInput(),
  paymentMode: entry.paymentMode || "",
  referenceNo: entry.referenceNo || "",
  description: entry.description,
  notes: entry.notes || "",
  isRecurring: entry.isTemplate,
  recurrence: entry.recurrence || "MONTHLY",
  scheduleOnly: false,
});

const placeholders: Record<string, string> = {
  CLIENT_PAYMENT: "Deposit from the client",
  SALARY: "November salaries",
  PETTY_OFFICE: "Water, transport, and small office costs",
  RENT: "Office rent",
  HOSTING: "Monthly hosting",
};

export const BookEntryDialog = ({
  open,
  onOpenChange,
  entry,
  draft,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: BookEntry | null;
  draft: BookDraft | null;
}) => {
  const [form, setForm] = useState<FormState>(blankForm);
  const create = useCreateBookEntry();
  const update = useUpdateBookEntry();
  const pending = create.isPending || update.isPending;
  const isPipeline = entry?.source === "PIPELINE";
  const showSchedule = !isPipeline && (!entry || entry.isTemplate);

  useEffect(() => {
    if (!open) return;
    if (entry) {
      setForm(formFromEntry(entry));
      return;
    }
    setForm({ ...blankForm(), ...draft });
  }, [open, entry, draft]);

  const setEntryType = (entryType: BookEntryType) => {
    setForm((current) => {
      const categories = BOOK_CATEGORIES[entryType];
      const category = categories.some((item) => item.value === current.category)
        ? current.category
        : categories[0].value;
      return { ...current, entryType, category };
    });
  };

  const setCategory = (category: string) => {
    setForm((current) => ({
      ...current,
      category,
      isRecurring:
        !entry && RECURRING_CATEGORY_DEFAULTS.has(category)
          ? true
          : current.isRecurring,
    }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.description.trim()) {
      toast.error("Add a short description.");
      return;
    }
    const amount = Number(form.amount);
    if (!(amount > 0)) {
      toast.error("Enter an amount greater than zero.");
      return;
    }
    const recurring = showSchedule && form.isRecurring;
    const payload: SaveBookEntryRequest = {
      entryType: isPipeline ? "REVENUE" : form.entryType,
      category: form.category,
      amount,
      entryDate: form.entryDate,
      paymentMode: form.paymentMode || null,
      referenceNo: form.referenceNo,
      description: form.description.trim(),
      notes: form.notes,
      isRecurring: recurring,
      recurrence: recurring ? form.recurrence : null,
      scheduleOnly: !entry && recurring ? form.scheduleOnly : false,
    };
    if (entry) {
      update.mutate(
        { id: entry.id, data: payload },
        { onSuccess: () => onOpenChange(false) },
      );
      return;
    }
    create.mutate(payload, { onSuccess: () => onOpenChange(false) });
  };

  const title = entry?.isTemplate
    ? "Edit schedule"
    : entry
      ? "Edit entry"
      : "Record entry";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isPipeline
              ? "This came from a pipeline payment. Changes stay in the books and do not rewrite the deal log."
              : entry?.isTemplate
                ? "Update the amount, category, or how often this repeats. Months already posted stay as they are."
                : entry?.recurrenceParentId
                  ? "This line was posted from a recurring schedule. Editing it changes only this occurrence."
                  : "Record income or a cost. Salaries, petty office expenses, rent, and hosting can repeat."}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="book-type">Type</Label>
              <select
                id="book-type"
                className={controlClass}
                value={form.entryType}
                disabled={isPipeline}
                onChange={(event) =>
                  setEntryType(event.target.value as BookEntryType)
                }
              >
                <option value="REVENUE">Revenue</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="book-category">Category</Label>
              <select
                id="book-category"
                className={controlClass}
                value={form.category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {BOOK_CATEGORIES[form.entryType].map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="book-description">Description</Label>
            <Input
              id="book-description"
              value={form.description}
              placeholder={placeholders[form.category] || "What this record is for"}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="book-amount">Amount (GHS)</Label>
              <Input
                id="book-amount"
                type="number"
                min="0.01"
                step="0.01"
                inputMode="decimal"
                value={form.amount}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    amount: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="book-date">Date</Label>
              <Input
                id="book-date"
                type="date"
                value={form.entryDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    entryDate: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="book-mode">Payment mode</Label>
              <select
                id="book-mode"
                className={controlClass}
                value={form.paymentMode}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    paymentMode: event.target.value,
                  }))
                }
              >
                <option value="">Not specified</option>
                {BOOK_PAYMENT_MODES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="book-reference">Reference</Label>
              <Input
                id="book-reference"
                value={form.referenceNo}
                placeholder="Receipt, invoice, or MoMo ref"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    referenceNo: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="book-notes">Notes</Label>
            <Textarea
              id="book-notes"
              value={form.notes}
              onChange={(event) =>
                setForm((current) => ({ ...current, notes: event.target.value }))
              }
            />
          </div>
          {showSchedule && (
            <div className="space-y-3 rounded-xl border bg-muted/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Recurring</p>
                  <p className="text-xs text-muted-foreground">
                    Use this for salaries, petty office expenses, rent, and retainers.
                  </p>
                </div>
                <Switch
                  checked={form.isRecurring}
                  onCheckedChange={(checked) =>
                    setForm((current) => ({ ...current, isRecurring: checked }))
                  }
                  aria-label="Recurring"
                />
              </div>
              {form.isRecurring && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="book-recurrence">Repeats</Label>
                    <select
                      id="book-recurrence"
                      className={controlClass}
                      value={form.recurrence}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          recurrence: event.target.value as BookRecurrence,
                        }))
                      }
                    >
                      {BOOK_RECURRENCE.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!entry && (
                    <label className="flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={form.scheduleOnly}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            scheduleOnly: event.target.checked,
                          }))
                        }
                      />
                      <span>
                        Save the schedule only. It counts in a month after you post it.
                      </span>
                    </label>
                  )}
                </>
              )}
              {entry?.isTemplate && !form.isRecurring && (
                <p className="text-xs text-muted-foreground">
                  This schedule will become a single entry on the date above.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending
                ? "Saving…"
                : entry
                  ? "Save changes"
                  : form.isRecurring && form.scheduleOnly
                    ? "Save schedule"
                    : "Save entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

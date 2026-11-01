"use client";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import type { Deal, DealLog } from "@/types/deal.types";
import type { User } from "@/types/user.types";
import type { PaymentMode } from "@/types/api.types";
import { useAddDealLog } from "@/hooks/useDeals";
import { LogFeed } from "../LogFeed";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z
  .object({
    amount: z
      .union([z.number(), z.string()])
      .transform((val) => {
        if (typeof val === "number") return Math.max(0, val);
        const clean = String(val).replace(/[^0-9.-]/g, "").trim();
        const parsed = parseFloat(clean);
        return isNaN(parsed) ? 0 : Math.max(0, parsed);
      })
      .refine((v) => v > 0, "Enter an amount greater than zero."),
    invoiceIssued: z.boolean(),
    invoice: z.string().optional(),
    receipt: z.string().min(1, "Enter a receipt number."),
    paymentType: z.enum(["DEPOSIT", "INSTALLMENT", "FINAL_PAYMENT"]),
    mode: z.enum(["MOMO", "BANK_TRANSFER", "CASH", "CHEQUE"]),
  })
  .superRefine((values, context) => {
    if (values.invoiceIssued && !values.invoice?.trim())
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["invoice"],
        message: "Enter the issued invoice number.",
      });
  });

type Values = z.infer<typeof schema>;

export const PaymentLog = ({
  deal,
  logs,
  users,
}: {
  deal: Deal;
  logs: DealLog[];
  users: User[];
}) => {
  const mutation = useAddDealLog();
  const queryClient = useQueryClient();
  const {
    register,
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      invoiceIssued: true,
      paymentType: "INSTALLMENT",
      mode: "MOMO",
    },
  });
  const values = useWatch({ control });

  const submit = handleSubmit((data) =>
    mutation.mutate(
      {
        dealId: deal.id,
        data: {
          logType: "PAYMENT",
          amountPaid: data.amount,
          invoiceIssued: data.invoiceIssued,
          invoiceNumber: data.invoice || undefined,
          receiptNumber: data.receipt,
          paymentMode: data.mode as PaymentMode,
          body: `${data.paymentType.replaceAll("_", " ")} payment recorded.`,
        },
      },
      {
        onSuccess: () => {
          void Promise.all([
            queryClient.invalidateQueries({ queryKey: ["deals"] }),
            queryClient.invalidateQueries({ queryKey: ["pipeline"] }),
            queryClient.invalidateQueries({ queryKey: ["deal-logs", deal.id] }),
          ]);
          reset();
        },
      },
    ),
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 rounded-xl bg-gray-900 p-3 text-white">
        {[
          ["Agreed amount", deal.contractValue],
          ["Total paid", deal.totalPaid],
          ["Left", deal.arrears],
        ].map(([label, value]) => (
          <div key={String(label)}>
            <p className="text-[10px] text-gray-400">{label}</p>
            <p className="text-sm font-semibold">
              {formatCurrency(Number(value))}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-3 border-b pb-4">
        <div>
          <Label>Amount (GH¢)</Label>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-semibold text-muted-foreground">
              GH¢
            </span>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              className="pl-12"
              {...register("amount")}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-danger">{errors.amount.message}</p>
          )}
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <Label>Invoice issued</Label>
          <Switch
            checked={Boolean(values.invoiceIssued)}
            onCheckedChange={(checked) => setValue("invoiceIssued", checked)}
          />
        </div>
        {values.invoiceIssued && (
          <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
            Issuing an invoice does not prove delivery. Open the invoice and check
            “Invoice reception confirmed” only after the client definitely receives it.
          </p>
        )}
        {values.invoiceIssued && (
          <div>
            <Label>Invoice number</Label>
            <Input
              placeholder="INV-0001"
              disabled={!values.invoiceIssued}
              {...register("invoice")}
            />
            {errors.invoice && (
              <p className="text-xs text-danger">{errors.invoice.message}</p>
            )}
          </div>
        )}
        <div>
          <Label>Receipt number</Label>
          <Input placeholder="REC-0001" {...register("receipt")} />
          {errors.receipt && (
            <p className="text-xs text-danger">{errors.receipt.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Payment type</Label>
            <Select
              value={values.paymentType}
              onValueChange={(val: any) => setValue("paymentType", val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEPOSIT">Deposit</SelectItem>
                <SelectItem value="INSTALLMENT">Installment</SelectItem>
                <SelectItem value="FINAL_PAYMENT">Final payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Payment mode</Label>
            <Select
              value={values.mode}
              onValueChange={(val: any) => setValue("mode", val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MOMO">Mobile money</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank transfer</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="CHEQUE">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Recording…" : "Record payment"}
        </Button>
      </form>
      <LogFeed dealId={deal.id} logs={logs} users={users} />
    </div>
  );
};

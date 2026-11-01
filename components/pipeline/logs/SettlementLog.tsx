"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zodResolver";
import { useQueryClient } from "@tanstack/react-query";
import type { Deal, DealLog } from "@/types/deal.types";
import type { User } from "@/types/user.types";
import { useAddDealLog } from "@/hooks/useDeals";
import { LogFeed } from "../LogFeed";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  conditions: z.string().min(5, "Add a short summary."),
  value: z.preprocess((val) => {
    if (val === null || val === undefined || val === "") return 0;
    if (typeof val === "number") return isNaN(val) ? 0 : Math.max(0, val);
    const clean = String(val).replace(/[^0-9.-]/g, "").trim();
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
  }, z.number().min(0.01, "Enter a positive contract value.")),
  followUp: z.string().min(1, "Choose a payment follow-up date."),
});

type Values = z.infer<typeof schema>;

export const SettlementLog = ({
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
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { value: deal.contractValue || undefined },
  });

  const submit = handleSubmit((data) =>
    mutation.mutate(
      {
        dealId: deal.id,
        data: {
          logType: "SETTLEMENT",
          specialConditions: data.conditions,
          settlementValue: Number(data.value),
          settlementFollowUp: new Date(data.followUp).toISOString(),
          body: data.conditions,
        },
      },
      {
        onSuccess: () => {
          void Promise.all([
            queryClient.invalidateQueries({ queryKey: ["deals"] }),
            queryClient.invalidateQueries({ queryKey: ["pipeline"] }),
            queryClient.invalidateQueries({ queryKey: ["deal-logs", deal.id] }),
          ]);
          reset({ value: data.value, conditions: "", followUp: "" });
        },
      },
    ),
  );

  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="space-y-3 border-b pb-4">
        <h4 className="font-semibold">Settlement details</h4>
        <div>
          <Label>Special conditions</Label>
          <Textarea
            placeholder="Enter agreed conditions…"
            {...register("conditions")}
          />
          {errors.conditions && (
            <p className="text-xs text-danger">{errors.conditions.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Agreed contract amount (GH¢)</Label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-semibold text-muted-foreground">
                GH¢
              </span>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                className="pl-12"
                {...register("value")}
              />
            </div>
            {errors.value && (
              <p className="text-xs text-danger">{errors.value.message}</p>
            )}
          </div>
          <div>
            <Label>Payment follow-up</Label>
            <Input type="datetime-local" {...register("followUp")} />
            {errors.followUp && (
              <p className="text-xs text-danger">{errors.followUp.message}</p>
            )}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save log"}
        </Button>
      </form>
      <LogFeed dealId={deal.id} logs={logs} users={users} />
    </div>
  );
};

"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zodResolver";
import type { Deal } from "@/types/deal.types";
import type { DealStage, Priority } from "@/types/api.types";
import { useUpdateDeal } from "@/hooks/useDeals";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssigneePicker } from "@/components/shared/AssigneePicker";

const schema = z.object({
  title: z.string().min(3, "Enter a descriptive deal title."),
  assigneeIds: z.array(z.string()),
  stage: z.enum([
    "PROSPECTING",
    "NEGOTIATION",
    "SETTLEMENT",
    "PAYMENT",
    "CLIENT_RETENTION",
  ]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  contractValue: z.preprocess((val) => {
    if (val === null || val === undefined || val === "") return 0;
    if (typeof val === "number") return isNaN(val) ? 0 : Math.max(0, val);
    const clean = String(val).replace(/[^0-9.-]/g, "").trim();
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
  }, z.number().min(0, "Contract value cannot be negative.")),
  totalPaid: z.preprocess((val) => {
    if (val === null || val === undefined || val === "") return 0;
    if (typeof val === "number") return isNaN(val) ? 0 : Math.max(0, val);
    const clean = String(val).replace(/[^0-9.-]/g, "").trim();
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
  }, z.number().min(0, "Total paid cannot be negative.")),
  notes: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export const EditDealModal = ({
  deal,
  open,
  onOpenChange,
}: {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const update = useUpdateDeal();
  const users = useUsers({ page: 0, size: 100 });

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
      title: "",
      assigneeIds: [],
      stage: "PROSPECTING",
      priority: "MEDIUM",
      contractValue: 0,
      totalPaid: 0,
      notes: "",
    },
  });

  const values = useWatch({ control });

  useEffect(() => {
    if (!open || !deal) return;
    reset({
      title: deal.title || "",
      assigneeIds: deal.assigneeIds?.length
        ? deal.assigneeIds
        : deal.assignedToId
          ? [deal.assignedToId]
          : [],
      stage: deal.stage || "PROSPECTING",
      priority: deal.priority || "MEDIUM",
      contractValue: deal.contractValue ?? 0,
      totalPaid: deal.totalPaid ?? 0,
      notes: deal.notes || "",
    });
  }, [deal, open, reset]);

  if (!deal) return null;

  const submit = handleSubmit((data) =>
    update.mutate(
      {
        id: deal.id,
        data: {
          title: data.title,
          assigneeIds: data.assigneeIds,
          stage: data.stage as DealStage,
          priority: data.priority as Priority,
          contractValue: Number(data.contractValue || 0),
          totalPaid: Number(data.totalPaid || 0),
          currency: "GHS",
          notes: data.notes || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    )
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit pipeline deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Deal title</Label>
            <Input {...register("title")} />
            {errors.title && (
              <p className="mt-1 text-xs text-danger">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label>Assignees</Label>
            <AssigneePicker
              users={users.data?.content ?? []}
              value={values.assigneeIds ?? []}
              onChange={(ids) => setValue("assigneeIds", ids)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Stage</Label>
              <Select
                value={values.stage}
                onValueChange={(val: DealStage) => setValue("stage", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    [
                      "PROSPECTING",
                      "NEGOTIATION",
                      "SETTLEMENT",
                      "PAYMENT",
                      "CLIENT_RETENTION",
                    ] as const
                  ).map((stg) => (
                    <SelectItem key={stg} value={stg}>
                      {stg.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={values.priority}
                onValueChange={(val: Priority) => setValue("priority", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Contract value / Price (GH¢)</Label>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-semibold text-muted-foreground">
                  GH¢
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="pl-12"
                  {...register("contractValue")}
                />
              </div>
              {errors.contractValue && (
                <p className="mt-1 text-xs text-danger">
                  {errors.contractValue.message}
                </p>
              )}
            </div>
            <div>
              <Label>Total paid (GH¢)</Label>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-semibold text-muted-foreground">
                  GH¢
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="pl-12"
                  {...register("totalPaid")}
                />
              </div>
              {errors.totalPaid && (
                <p className="mt-1 text-xs text-danger">
                  {errors.totalPaid.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea {...register("notes")} />
          </div>

          <Button type="submit" className="w-full" disabled={update.isPending}>
            {update.isPending ? "Saving changes…" : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

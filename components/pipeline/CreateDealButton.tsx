"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zodResolver";
import { Plus } from "lucide-react";
import { useCreateDeal } from "@/hooks/useDeals";
import { useLeads } from "@/hooks/useLeads";
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
import type { DealStage, Priority } from "@/types/api.types";

const schema = z.object({
  title: z.string().min(3, "Enter a descriptive deal title."),
  leadId: z.string().optional(),
  assignedToId: z.string().optional(),
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
  notes: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export const CreateDealButton = () => {
  const [open, setOpen] = useState(false);
  const create = useCreateDeal();
  const leads = useLeads({ page: 0, size: 100 });
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
      leadId: "",
      assignedToId: "",
      stage: "PROSPECTING",
      priority: "MEDIUM",
      contractValue: "" as any,
      notes: "",
    },
  });
  const values = useWatch({ control });
  const submit = handleSubmit((data) =>
    create.mutate(
      {
        title: data.title,
        leadId: data.leadId || undefined,
        assignedToId: data.assignedToId || undefined,
        stage: data.stage as DealStage,
        priority: data.priority as Priority,
        contractValue: Number(data.contractValue || 0),
        currency: "GHS",
        notes: data.notes || undefined,
      },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      },
    ),
  );
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        New deal
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create pipeline deal</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Deal title</Label>
              <Input {...register("title")} />
              {errors.title && (
                <p className="mt-1 text-xs text-danger">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <Label>Linked lead</Label>
              <Select
                value={values.leadId || "NONE"}
                onValueChange={(value) =>
                  setValue("leadId", value === "NONE" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">No linked lead</SelectItem>
                  {(leads.data?.content ?? []).map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.firstName} {lead.lastName} · {lead.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assignee</Label>
              <Select
                value={values.assignedToId || "NONE"}
                onValueChange={(value) =>
                  setValue("assignedToId", value === "NONE" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Unassigned</SelectItem>
                  {(users.data?.content ?? [])
                    .filter((user) => user.active)
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Stage</Label>
                <Select
                  value={values.stage}
                  onValueChange={(value: DealStage) => setValue("stage", value)}
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
                    ).map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={values.priority}
                  onValueChange={(value: Priority) =>
                    setValue("priority", value)
                  }
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
              <Label>Notes</Label>
              <Textarea {...register("notes")} />
            </div>
            <Button type="submit" className="w-full" disabled={create.isPending}>
              {create.isPending ? "Creating…" : "Create deal"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

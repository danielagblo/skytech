"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Lead } from "@/types/lead.types";
import type { Priority } from "@/types/api.types";
import type { User } from "@/types/user.types";
import { useConvertLead } from "@/hooks/useLeads";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Workflow } from "lucide-react";

const schema = z.object({
  title: z.string().min(3, "Enter a descriptive deal title."),
  assignedToId: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  contractValue: z.preprocess((val) => {
    if (val === null || val === undefined || val === "") return 0;
    if (typeof val === "number") return isNaN(val) ? 0 : Math.max(0, val);
    const clean = String(val).replace(/[^0-9.-]/g, "").trim();
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
  }, z.number().min(0, "Contract value cannot be negative.")),
});

type Values = z.infer<typeof schema>;

export const ConvertLeadModal = ({
  lead,
  users,
  open,
  onOpenChange,
  onSuccess,
}: {
  lead: Lead | null;
  users: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) => {
  const convert = useConvertLead();

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
      assignedToId: "",
      priority: "MEDIUM",
      contractValue: "" as any,
    },
  });

  const values = useWatch({ control });

  useEffect(() => {
    if (!open || !lead) return;
    const defaultTitle = `${lead.companyName || `${lead.firstName || ""} ${lead.lastName || ""}`.trim() || "New"} Deal`;
    const defaultAssignee = Array.isArray(lead.assignedTo) && lead.assignedTo.length > 0 
      ? lead.assignedTo[0] 
      : "";
    reset({
      title: defaultTitle,
      assignedToId: defaultAssignee,
      priority: (lead.priority as Priority) || "MEDIUM",
      contractValue: "" as any,
    });
  }, [lead, open, reset]);

  if (!lead) return null;

  const submit = handleSubmit((data) =>
    convert.mutate(
      {
        id: lead.id,
        data: {
          title: data.title,
          assignedToId: data.assignedToId || undefined,
          priority: data.priority as Priority,
          contractValue: Number(data.contractValue || 0),
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      }
    )
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Workflow className="h-5 w-5" />
            <DialogTitle>Convert Lead to Pipeline Deal</DialogTitle>
          </div>
          <DialogDescription>
            Create an active pipeline deal for{" "}
            <span className="font-semibold text-foreground">
              {lead.companyName || `${lead.firstName || ""} ${lead.lastName || ""}`.trim()}
            </span>
            . You can set the initial agreed contract price below.
          </DialogDescription>
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

          <div className="grid grid-cols-2 gap-3">
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

            <div>
              <Label>Assignee</Label>
              <Select
                value={values.assignedToId || "NONE"}
                onValueChange={(val) =>
                  setValue("assignedToId", val === "NONE" ? "" : val)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Unassigned</SelectItem>
                  {(users || [])
                    .filter((u) => u.active)
                    .map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.firstName} {u.lastName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={convert.isPending}
            >
              {convert.isPending ? "Converting…" : "Convert to Deal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

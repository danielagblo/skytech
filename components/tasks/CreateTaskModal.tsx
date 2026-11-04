"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useCreateTaskWithSubtasks } from "@/hooks/useTasks";
import { useLeads } from "@/hooks/useLeads";
import { useDeals, useUpdateDeal } from "@/hooks/useDeals";
import { useUsers } from "@/hooks/useUsers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DEAL_STAGE_LABELS } from "@/lib/crm-options";
import { AssigneePicker } from "@/components/shared/AssigneePicker";
import type { DealStage, Priority } from "@/types/api.types";

const dealStages = [
  "PROSPECTING",
  "NEGOTIATION",
  "SETTLEMENT",
  "PAYMENT",
  "CLIENT_RETENTION",
] as const;

type DealDraft = {
  title: string;
  assigneeIds: string[];
  stage: DealStage;
  priority: Priority;
  contractValue: string;
  totalPaid: string;
  notes: string;
  dueDate: string;
  reminder: boolean;
};
const schema = z.object({
  title: z.string().min(3, "Enter a task title."),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  assigneeIds: z.array(z.string()),
  reminder: z.boolean(),
  dueDate: z.string().optional(),
  description: z.string().min(10, "Add at least 10 characters."),
  subTasks: z.array(
    z.object({
      title: z.string().min(2),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
      description: z.string().min(3),
    }),
  ),
});
type Values = z.infer<typeof schema>;
export const CreateTaskModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) => {
  const [caseType, setCaseType] = useState<"lead" | "deal">("lead");
  const [caseId, setCaseId] = useState("");
  const [dealDraft, setDealDraft] = useState<DealDraft | null>(null);
  const create = useCreateTaskWithSubtasks();
  const updateDeal = useUpdateDeal();
  const leads = useLeads({ page: 0, size: 100 });
  const deals = useDeals({ page: 0, size: 100 });
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
      priority: "LOW",
      assigneeIds: [],
      reminder: true,
      dueDate: "",
      description: "",
      subTasks: [],
    },
  });
  const values = useWatch({ control });
  const fields = useFieldArray({ control, name: "subTasks" });
  const submitValues = (
    data: Values,
    linked?: { linkedLeadId?: string; linkedDealId?: string },
  ) =>
    create.mutate(
      {
        task: {
          title: data.title,
          priority: data.priority,
          assigneeIds: data.assigneeIds ?? [],
          allowReminder: data.reminder,
          dueDate: data.dueDate
            ? new Date(data.dueDate).toISOString()
            : undefined,
          description: data.description,
          status: "TODO",
          ...linked,
        },
        subtasks: (data.subTasks || []).map((subtask) => ({
          ...subtask,
          complete: false,
        })),
      },
      {
        onSuccess: () => {
          reset();
          setCaseId("");
          setDealDraft(null);
          onOpenChange(false);
        },
      },
    );
  const save = handleSubmit((data) => submitValues(data));
  const selectDeal = (id: string) => {
    setCaseId(id);
    const deal = deals.data?.content.find((item) => item.id === id);
    if (!deal) {
      setDealDraft(null);
      return;
    }
    setDealDraft({
      title: deal.title || "",
      assigneeIds: deal.assigneeIds?.length
        ? deal.assigneeIds
        : deal.assignedToId
          ? [deal.assignedToId]
          : [],
      stage: deal.stage || "PROSPECTING",
      priority: deal.priority || "MEDIUM",
      contractValue: String(deal.contractValue ?? 0),
      totalPaid: String(deal.totalPaid ?? 0),
      notes: deal.notes || "",
      dueDate: "",
      reminder: true,
    });
  };
  const createFromCase = () => {
    const lead = leads.data?.content.find((item) => item.id === caseId);
    const title = `Follow up with ${lead?.firstName || "lead"} ${lead?.lastName || ""}`.trim();
    const description =
      lead?.description ||
      "Follow up on this pending CRM case and record the outcome.";
    submitValues(
      {
        ...values,
        title,
        description,
        priority: values.priority ?? "LOW",
        reminder: values.reminder ?? true,
        subTasks: values.subTasks ?? [],
      } as Values,
      { linkedLeadId: caseId },
    );
  };
  const saveDealAndCreate = async () => {
    if (!dealDraft || !caseId) return;
    if (dealDraft.title.trim().length < 3) {
      toast.error("Enter a deal title of at least 3 characters.");
      return;
    }
    const notes = dealDraft.notes.trim();
    try {
      await updateDeal.mutateAsync({
        id: caseId,
        data: {
          title: dealDraft.title.trim(),
          assigneeIds: dealDraft.assigneeIds,
          stage: dealDraft.stage,
          priority: dealDraft.priority,
          contractValue: Number(dealDraft.contractValue) || 0,
          totalPaid: Number(dealDraft.totalPaid) || 0,
          currency: "GHS",
          notes: notes || undefined,
        },
      });
    } catch {
      return;
    }
    submitValues(
      {
        title: `Follow up: ${dealDraft.title.trim()}`,
        description:
          notes.length >= 10
            ? notes
            : `Follow up on ${dealDraft.title.trim()} and record the outcome.`,
        priority: dealDraft.priority,
        assigneeIds: dealDraft.assigneeIds,
        reminder: dealDraft.reminder,
        dueDate: dealDraft.dueDate,
        subTasks: [],
      },
      { linkedDealId: caseId },
    );
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="manual">
          <TabsList>
            <TabsTrigger value="manual">Manual entry</TabsTrigger>
            <TabsTrigger value="case">Select pending case</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <form className="space-y-4" onSubmit={save}>
              <div>
                <Label>Title</Label>
                <Input {...register("title")} />
                {errors.title && (
                  <p className="text-xs text-danger">{errors.title.message}</p>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
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
                <Label>Assignees</Label>
                <AssigneePicker
                  users={users.data?.content ?? []}
                  value={values.assigneeIds ?? []}
                  onChange={(ids) => setValue("assigneeIds", ids)}
                />
              </div>
              <div>
                <Label>Due date</Label>
                <Input type="datetime-local" {...register("dueDate")} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label>Allow reminder</Label>
                <Switch
                  checked={Boolean(values.reminder)}
                  onCheckedChange={(value) => setValue("reminder", value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea {...register("description")} />
                {errors.description && (
                  <p className="text-xs text-danger">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label>Sub tasks</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      fields.append({
                        title: "",
                        priority: "LOW",
                        description: "",
                      })
                    }
                  >
                    <Plus className="h-3 w-3" />
                    Add subtask
                  </Button>
                </div>
                {fields.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="mb-3 grid gap-2 rounded-xl border p-3"
                  >
                    <div className="flex gap-2">
                      <Input
                        placeholder="Subtask title"
                        {...register(`subTasks.${index}.title`)}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => fields.remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Select
                      value={values.subTasks?.[index]?.priority || "LOW"}
                      onValueChange={(value: Priority) =>
                        setValue(`subTasks.${index}.priority`, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low priority</SelectItem>
                        <SelectItem value="MEDIUM">Medium priority</SelectItem>
                        <SelectItem value="HIGH">High priority</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Description"
                      {...register(`subTasks.${index}.description`)}
                    />
                  </div>
                ))}
              </div>
              <Button type="submit" className="w-full" disabled={create.isPending}>
                {create.isPending ? "Creating…" : "Create task"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="case">
            <p className="mb-3 text-sm text-muted-foreground">
              Select a pending lead or deal to create a linked follow-up task.
            </p>
            <div className="mb-3 flex gap-2">
              <Button
                variant={caseType === "lead" ? "default" : "outline"}
                onClick={() => {
                  setCaseType("lead");
                  setCaseId("");
                  setDealDraft(null);
                }}
              >
                Leads
              </Button>
              <Button
                variant={caseType === "deal" ? "default" : "outline"}
                onClick={() => {
                  setCaseType("deal");
                  setCaseId("");
                  setDealDraft(null);
                }}
              >
                Deals
              </Button>
            </div>
            <div className="max-h-72 space-y-2 overflow-y-auto">
              {caseType === "lead"
                ? (leads.data?.content ?? [])
                    .filter(
                      (lead) =>
                        lead.status !== "CONVERTED" && lead.status !== "LOST",
                    )
                    .map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => setCaseId(lead.id)}
                        className={`w-full rounded-xl border p-3 text-left ${caseId === lead.id ? "border-primary bg-green-50" : ""}`}
                      >
                        <strong className="text-sm">
                          {lead.firstName} {lead.lastName}
                        </strong>
                        <p className="text-xs text-muted-foreground">
                          {lead.companyName} · {lead.category}
                        </p>
                      </button>
                    ))
                : (deals.data?.content ?? []).map((deal) => (
                    <button
                      key={deal.id}
                      type="button"
                      onClick={() => selectDeal(deal.id)}
                      className={`w-full rounded-xl border p-3 text-left ${caseId === deal.id ? "border-primary bg-green-50" : ""}`}
                    >
                      <strong className="text-sm">{deal.title}</strong>
                      <p className="text-xs text-muted-foreground">
                        {DEAL_STAGE_LABELS[deal.stage] || deal.stage}
                      </p>
                    </button>
                  ))}
            </div>
            {caseType === "deal" && dealDraft && (
              <div className="mt-4 space-y-3 rounded-xl border p-3">
                <div>
                  <p className="text-sm font-medium">Review this deal</p>
                  <p className="text-xs text-muted-foreground">
                    Edit the deal, then create the follow-up task.
                  </p>
                </div>
                <div>
                  <Label>Deal title</Label>
                  <Input
                    value={dealDraft.title}
                    onChange={(event) =>
                      setDealDraft({ ...dealDraft, title: event.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Assignees</Label>
                  <AssigneePicker
                    users={users.data?.content ?? []}
                    value={dealDraft.assigneeIds}
                    onChange={(ids) =>
                      setDealDraft({ ...dealDraft, assigneeIds: ids })
                    }
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Priority</Label>
                    <Select
                      value={dealDraft.priority}
                      onValueChange={(value: Priority) =>
                        setDealDraft({ ...dealDraft, priority: value })
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
                  <Label>Stage</Label>
                  <Select
                    value={dealDraft.stage}
                    onValueChange={(value: DealStage) =>
                      setDealDraft({ ...dealDraft, stage: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dealStages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {DEAL_STAGE_LABELS[stage]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Contract value (GHS)</Label>
                    <Input
                      inputMode="decimal"
                      value={dealDraft.contractValue}
                      onChange={(event) =>
                        setDealDraft({
                          ...dealDraft,
                          contractValue: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Total paid (GHS)</Label>
                    <Input
                      inputMode="decimal"
                      value={dealDraft.totalPaid}
                      onChange={(event) =>
                        setDealDraft({
                          ...dealDraft,
                          totalPaid: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={dealDraft.notes}
                    onChange={(event) =>
                      setDealDraft({ ...dealDraft, notes: event.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Task due date</Label>
                  <Input
                    type="datetime-local"
                    value={dealDraft.dueDate}
                    onChange={(event) =>
                      setDealDraft({ ...dealDraft, dueDate: event.target.value })
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <Label>Allow reminder</Label>
                  <Switch
                    checked={dealDraft.reminder}
                    onCheckedChange={(value) =>
                      setDealDraft({ ...dealDraft, reminder: value })
                    }
                  />
                </div>
              </div>
            )}
            <Button
              className="mt-4 w-full"
              onClick={caseType === "deal" ? saveDealAndCreate : createFromCase}
              disabled={
                !caseId ||
                create.isPending ||
                updateDeal.isPending ||
                (caseType === "deal" && !dealDraft)
              }
            >
              {create.isPending || updateDeal.isPending
                ? "Creating…"
                : caseType === "deal"
                  ? "Save deal and create task"
                  : "Create from selected case"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

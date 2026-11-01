"use client";
import { useEffect, useState } from "react";
import {
  Building2,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
  Workflow,
} from "lucide-react";
import type { Lead } from "@/types/lead.types";
import type { User, UserSummary } from "@/types/user.types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AssigneeStack } from "@/components/shared/AssigneeStack";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { Button } from "@/components/ui/button";
import { CreateLeadModal } from "./CreateLeadModal";
import { ConvertLeadModal } from "./ConvertLeadModal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { usePermission } from "@/hooks/usePermission";
import { useDeleteLead } from "@/hooks/useLeads";
import { markLeadSeen } from "@/lib/seenLeads";

export const LeadDetail = ({
  lead,
  users,
  open,
  onOpenChange,
}: {
  lead: Lead | null;
  users: User[];
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) => {
  const [edit, setEdit] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const { can } = usePermission();
  const remove = useDeleteLead();

  useEffect(() => {
    if (open && lead) markLeadSeen(lead.id);
  }, [open, lead]);
  if (!lead) return null;
  const assignees = (lead.assignedTo ?? [])
    .map((id) => users.find((user) => user.id === id))
    .filter((user): user is User => Boolean(user)) as UserSummary[];
  const creator = users.find((user) => user.id === lead.createdById);
  const rows = [
    [Phone, lead.phone1 || "Not provided"],
    [Mail, lead.email || "Not provided"],
    [
      Building2,
      `${lead.companyName || "No company"} · ${lead.role || "No role"}`,
    ],
    [MapPin, lead.address || "Not provided"],
    [Calendar, lead.launchTimeline?.replaceAll("_", " ") || "Not set"],
  ] as const;

  const handleDelete = () => {
    remove.mutate(lead.id, {
      onSuccess: () => {
        setDeleteConfirm(false);
        onOpenChange(false);
      },
    });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-xl">Lead details</SheetTitle>
          </SheetHeader>
          <div className="text-center">
            <p className="eyebrow">Assignees</p>
            <div className="mt-3 flex justify-center gap-2">
              {assignees.length ? (
                <AssigneeStack users={assignees} />
              ) : (
                <span className="text-xs text-muted-foreground">
                  Unassigned
                </span>
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Created by {creator ? `${creator.firstName} ${creator.lastName}` : "CRM user"}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between border-b pb-4">
            <div>
              <p className="eyebrow">Priority</p>
              <div className="mt-2">
                <PriorityBadge priority={lead.priority || "MEDIUM"} />
              </div>
            </div>
            <div className="text-right">
              <p className="eyebrow">Status</p>
              <p className="mt-2 text-xs font-semibold">{lead.status}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            {rows.map(([Icon, label], index) => (
              <p key={index} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{label}</span>
              </p>
            ))}
          </div>
          <div className="mt-6 border-t pt-4">
            <p className="eyebrow">Notes</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {lead.description || "No description provided."}
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            <Button className="flex-1" onClick={() => setEdit(true)}>
              Edit details
            </Button>
            {lead.status !== "CONVERTED" && (
              <Button variant="outline" onClick={() => setConvertOpen(true)}>
                <Workflow className="h-4 w-4" />
                Convert
              </Button>
            )}
            {can("delete:leads") && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setDeleteConfirm(true)}
                aria-label="Delete lead"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <CreateLeadModal
        open={edit}
        onOpenChange={setEdit}
        lead={lead}
        users={users}
      />
      <ConvertLeadModal
        open={convertOpen}
        onOpenChange={setConvertOpen}
        lead={lead}
        users={users}
        onSuccess={() => onOpenChange(false)}
      />
      <ConfirmModal
        open={deleteConfirm}
        onOpenChange={setDeleteConfirm}
        title="Delete this lead?"
        description="This removes the lead from active CRM records. This action cannot be undone."
        confirmLabel="Delete lead"
        onConfirm={handleDelete}
        pending={remove.isPending}
      />
    </>
  );
};

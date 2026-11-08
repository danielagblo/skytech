"use client";
import { useEffect, useRef, useState } from "react";
import { Building2, Calendar, Mail, Phone, UserRound } from "lucide-react";
import type { Deal } from "@/types/deal.types";
import type { Lead } from "@/types/lead.types";
import type { User, UserSummary } from "@/types/user.types";
import type { DealStage } from "@/types/api.types";
import { useDeal, useDealLogs, useDeleteDeal } from "@/hooks/useDeals";
import { usePermission } from "@/hooks/usePermission";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { AssigneeStack } from "@/components/shared/AssigneeStack";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StageBadge } from "@/components/shared/StageBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardRemoveButton } from "@/components/shared/CardRemoveButton";
import { EditDealModal } from "./EditDealModal";
import { displayedFollowUp } from "./DealCard";
import { NegotiationLog } from "./logs/NegotiationLog";

import { markLeadSeen } from "@/lib/seenLeads";
import { SettlementLog } from "./logs/SettlementLog";
import { PaymentLog } from "./logs/PaymentLog";
import { ClientRetentionLog } from "./logs/ClientRetentionLog";
const order: DealStage[] = [
  "PROSPECTING",
  "NEGOTIATION",
  "SETTLEMENT",
  "PAYMENT",
  "CLIENT_RETENTION",
];

const tabForStage = (stage: DealStage) => {
  if (stage === "SETTLEMENT") return "settlement";
  if (stage === "PAYMENT") return "payment";
  if (stage === "CLIENT_RETENTION") return "retention";
  return "negotiation";
};

export const DealDetail = ({
  deal: initialDeal,
  lead,
  users,
  open,
  onOpenChange,
}: {
  deal: Deal | null;
  lead?: Lead;
  users: User[];
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [noteOverflows, setNoteOverflows] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  
  const liveDeal = useDeal(initialDeal?.id ?? "");
  const deal = liveDeal.data ?? initialDeal;
  
  const logs = useDealLogs(deal?.id ?? "");
  const removeDeal = useDeleteDeal();
  const { can } = usePermission();
  useEffect(() => {
    if (open && lead) markLeadSeen(lead.id);
    if (!open) setShowExtra(false);
  }, [open, lead]);
  const noteText = lead?.description || deal?.notes || "No description provided.";
  useEffect(() => {
    const node = noteRef.current;
    if (!node || expanded) return;
    const measure = () => {
      setNoteOverflows(node.scrollHeight > node.clientHeight + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [noteText, expanded, open]);
  if (!deal) return null;
  const reached = (stage: DealStage) =>
    order.indexOf(stage) <= order.indexOf(deal.stage) &&
    stage !== "PROSPECTING";
  const assigneeIds = deal.assigneeIds?.length
    ? deal.assigneeIds
    : deal.assignedToId
      ? [deal.assignedToId]
      : [];
  const assignees = users.filter((user) => assigneeIds.includes(user.id));
  const creator = users.find((user) => user.id === deal.createdById);
  const latestFollowUp = displayedFollowUp(logs.data ?? [], deal.stage);
  const hasFollowUp = Boolean(latestFollowUp);
  const contactName = lead
    ? `${lead.firstName || ""} ${lead.lastName || ""}`.trim() || "Unnamed"
    : "No linked lead";
  const stageLogs = (
    type: "NEGOTIATION" | "SETTLEMENT" | "PAYMENT" | "CLIENT_RETENTION",
  ) => (logs.data ?? []).filter((log) => log.logType === type);
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-xl p-0 sm:max-w-[min(56rem,50vw)] overflow-y-auto">
        <div className="p-6">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StageBadge stage={deal.stage} />
                {deal.priority && <PriorityBadge priority={deal.priority} />}
              </div>
              {deal.stage !== "PROSPECTING" && deal.stage !== "NEGOTIATION" && (
                <div className="text-right">
                  <p className="eyebrow">Agreed Value</p>
                  <p className="text-base font-bold text-green-700 dark:text-green-400">
                    {formatCurrency(deal.contractValue)}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <SheetTitle className="min-w-0 text-xl">{deal.title}</SheetTitle>
              <div className="flex flex-wrap items-center gap-2">
                {can("delete:deals") && (
                  <CardRemoveButton
                    label={deal.title}
                    pending={removeDeal.isPending}
                    onRemove={() =>
                      removeDeal.mutate(deal.id, {
                        onSuccess: () => onOpenChange(false),
                      })
                    }
                  />
                )}
                <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
                  Edit deal
                </Button>
              </div>
            </div>
          </SheetHeader>

          {deal.stage !== "PROSPECTING" && deal.stage !== "NEGOTIATION" && (
          <div className="mt-4 grid grid-cols-1 gap-2 rounded-xl border bg-muted/30 p-3 text-center min-[420px]:grid-cols-3">
            <div className="border-r pr-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Contract Deal</p>
              <p className="mt-1 text-sm font-bold text-green-700 dark:text-green-400">
                {formatCurrency(deal.contractValue)}
              </p>
            </div>
            <div className="border-r pr-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total Paid</p>
              <p className="mt-1 text-sm font-bold text-foreground">
                {formatCurrency(deal.totalPaid)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Arrears (Due)</p>
              <p className={`mt-1 text-sm font-bold ${deal.arrears > 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}>
                {formatCurrency(deal.arrears)}
              </p>
            </div>
          </div>
          )}

          <div className="mt-4 rounded-2xl bg-muted/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Assignees</p>
                <div className="mt-2">
                  {assignees.length > 0 ? (
                    <AssigneeStack users={assignees as UserSummary[]} />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Unassigned
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="eyebrow">Created by</p>
                <p className="mt-2 text-sm font-medium">
                  {creator
                    ? `${creator.firstName} ${creator.lastName}`
                    : "CRM user"}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <p className="flex items-start gap-2">
                <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="break-words font-medium">{contactName}</span>
              </p>
              <p className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="break-words">{lead?.phone1 || "Not provided"}</span>
              </p>
              <p className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="break-words">{lead?.email || "Not provided"}</span>
              </p>
              <p className="flex items-start gap-2">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="break-words">{lead?.companyName || "No company"}</span>
              </p>
              <p className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>
                  {hasFollowUp
                    ? `Follow-up ${formatDate(latestFollowUp as string)}`
                    : "No follow-up set"}
                </span>
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-sm sm:grid-cols-2">
              <div>
                <p className="eyebrow">Service</p>
                <p className="mt-1 break-words font-medium">{lead?.service || "—"}</p>
              </div>
              <div>
                <p className="eyebrow">Industry</p>
                <p className="mt-1 break-words font-medium">{lead?.industry || "—"}</p>
              </div>
            </div>
            <p
              ref={noteRef}
              className={`mt-4 whitespace-pre-line text-sm text-muted-foreground ${expanded ? "" : "line-clamp-3"}`}
            >
              {noteText}
            </p>
            {(noteOverflows || expanded) && (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="mt-1 text-xs font-semibold text-green-700"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
            <div className="mt-4 border-t pt-3">
              <button
                type="button"
                onClick={() => setShowExtra((value) => !value)}
                className="text-xs font-semibold text-green-700"
              >
                {showExtra ? "Show less" : "Show more"}
              </button>
              {showExtra && (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                    <div>
                      <p className="eyebrow">Role</p>
                      <p className="mt-1 break-words">{lead?.role || "—"}</p>
                    </div>
                    <div>
                      <p className="eyebrow">Address</p>
                      <p className="mt-1 break-words">{lead?.address || "—"}</p>
                    </div>
                    <div>
                      <p className="eyebrow">Launch date</p>
                      <p className="mt-1">
                        {lead?.launchTimeline?.replace(/_/g, " ") || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow">Issued</p>
                      <p className="mt-1">{formatDate(deal.createdAt)}</p>
                    </div>
                    <div>
                      <p className="eyebrow">Public office</p>
                      <p className="mt-1">{lead?.hasPublicOffice ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <p className="eyebrow">Meeting</p>
                      <p className="mt-1">
                        {lead?.meetingArranged ? "Confirmed" : "Not arranged"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs">
                    <label className="flex items-center gap-2">
                      <Checkbox checked={Boolean(lead?.smsOptIn)} disabled />
                      SMS reminder
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox checked={Boolean(lead?.emailOptIn)} disabled />
                      Email reminder
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox checked={Boolean(lead?.newsletterOptIn)} disabled />
                      Newsletter
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {deal.stage === "PROSPECTING" ? (
          <div className="mx-6 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            Move this deal to Negotiation to begin logging client interactions.
          </div>
        ) : logs.isLoading ? (
          <div className="space-y-3 px-6">
            <Skeleton className="h-10" />
            <Skeleton className="h-56" />
          </div>
        ) : (
          <Tabs
            key={`${deal.id}-${deal.stage}`}
            defaultValue={tabForStage(deal.stage)}
            className="px-6 pb-8"
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              {reached("NEGOTIATION") && (
                <TabsTrigger value="negotiation">Negotiation</TabsTrigger>
              )}
              {reached("SETTLEMENT") && (
                <TabsTrigger value="settlement">Settlement</TabsTrigger>
              )}
              {reached("PAYMENT") && (
                <TabsTrigger value="payment">Payment</TabsTrigger>
              )}
              {reached("CLIENT_RETENTION") && (
                <TabsTrigger value="retention">Retention</TabsTrigger>
              )}
            </TabsList>
            {reached("NEGOTIATION") && (
              <TabsContent value="negotiation">
                <NegotiationLog
                  deal={deal}
                  logs={stageLogs("NEGOTIATION")}
                  users={users}
                />
              </TabsContent>
            )}
            {reached("SETTLEMENT") && (
              <TabsContent value="settlement">
                <SettlementLog
                  deal={deal}
                  logs={stageLogs("SETTLEMENT")}
                  users={users}
                />
              </TabsContent>
            )}
            {reached("PAYMENT") && (
              <TabsContent value="payment">
                <PaymentLog
                  deal={deal}
                  logs={stageLogs("PAYMENT")}
                  users={users}
                />
              </TabsContent>
            )}
            {reached("CLIENT_RETENTION") && (
              <TabsContent value="retention">
                <ClientRetentionLog
                  deal={deal}
                  logs={stageLogs("CLIENT_RETENTION")}
                  users={users}
                />
              </TabsContent>
            )}
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
    <EditDealModal deal={deal} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
};

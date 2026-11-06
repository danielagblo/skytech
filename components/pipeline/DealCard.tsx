"use client";
import { CalendarClock, MessageSquare, Phone, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import type { Deal, DealLog } from "@/types/deal.types";
import type { Lead } from "@/types/lead.types";
import type { User, UserSummary } from "@/types/user.types";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { AssigneeStack } from "@/components/shared/AssigneeStack";
import { CardRemoveButton } from "@/components/shared/CardRemoveButton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { isLeadSeen } from "@/lib/seenLeads";

export function displayedFollowUp(logs: DealLog[]) {
  const paymentFollowUp = logs
    .filter((log) => log.logType === "PAYMENT" && log.followUpAt)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0]?.followUpAt;
  if (paymentFollowUp) return paymentFollowUp;

  const dates = logs
    .map((log) => log.followUpAt || log.settlementFollowUp)
    .filter((date): date is string => Boolean(date))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  return dates.length ? dates[dates.length - 1] : null;
}

export const DealCard = ({
  deal,
  lead,
  assignees = [],
  logs,
  onClick,
  onRemove,
  removing,
}: {
  deal: Deal;
  lead?: Lead;
  assignees?: User[];
  logs: DealLog[];
  onClick: () => void;
  onRemove?: () => void;
  removing?: boolean;
}) => {
  const followUp = displayedFollowUp(logs);
  const services = [
    ["DOMAIN", deal.domainExpiry, deal.domainCost],
    ["HOSTING", deal.hostingExpiry, deal.hostingCost],
    ["MAINTENANCE", deal.maintenanceExpiry, deal.maintenanceCost],
  ] as const;
  const [isSeen, setIsSeen] = useState(true);
  useEffect(() => {
    setIsSeen(lead ? isLeadSeen(lead.id) : true);
  }, [lead]);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      className="w-full rounded-md border bg-card p-3 text-left shadow-[0_1px_2px_rgba(15,23,42,.04)] transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="line-clamp-2 text-sm font-semibold">{deal.title}</h4>
        {deal.priority && <PriorityBadge priority={deal.priority} />}
      </div>
      <div className="mt-2 flex items-center justify-between rounded-md bg-muted/40 px-2 py-1 text-xs">
        <span className="text-[11px] font-medium text-muted-foreground">Contract Deal:</span>
        <span className="font-bold text-green-700 dark:text-green-400">
          {formatCurrency(deal.contractValue)}
        </span>
      </div>
      <div className="mt-2.5 space-y-1.5 text-xs text-muted-foreground">
        <p className="flex items-center gap-2">
          <UserRound className="h-3.5 w-3.5" />
          {lead ? (
            <span className="flex items-center gap-2">
              {!isSeen && (
                <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-primary/80" />
              )}
              <span>{`${lead.firstName || "Unnamed"} · ${lead.role || "Contact"}`}</span>
            </span>
          ) : (
            "No linked lead"
          )}
        </p>
        <p className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5" />
          {lead?.phone1 || "No phone number"}
        </p>
        <p className="flex items-center gap-2">
          <CalendarClock className="h-3.5 w-3.5" />
          {followUp
            ? `Follow-up ${formatDate(followUp)}`
            : `Issued ${formatDate(deal.createdAt)}`}
        </p>
      </div>
      {deal.stage === "PAYMENT" && (
        <p
          className={`mt-3 rounded-md px-2 py-1 text-xs font-semibold ${deal.paidInFull ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"}`}
        >
          {deal.paidInFull
            ? "Paid in full"
            : `${formatCurrency(deal.arrears)} in arrears`}
        </p>
      )}
      {deal.stage === "CLIENT_RETENTION" && (
        <div className="mt-3 space-y-1 border-t pt-2 text-[10px] text-muted-foreground">
          {services.map(
            ([type, expiry, cost]) =>
              expiry && (
                <p key={type}>
                  {type}: {formatDate(expiry)} · {formatCurrency(cost)}
                </p>
              ),
          )}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between border-t pt-2">
        {assignees.length > 0 ? (
          <AssigneeStack users={assignees as UserSummary[]} />
        ) : (
          <span className="text-[10px] text-muted-foreground">Unassigned</span>
        )}
        <span className="flex items-center gap-1">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            {deal.notes ? 1 : 0}
          </span>
          {onRemove && (
            <CardRemoveButton
              label={deal.title}
              pending={removing}
              onRemove={onRemove}
            />
          )}
        </span>
      </div>
    </div>
  );
};

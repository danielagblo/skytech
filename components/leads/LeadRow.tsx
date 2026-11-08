import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Lead } from "@/types/lead.types";
import type { User, UserSummary } from "@/types/user.types";
import { TableCell, TableRow } from "@/components/ui/table";
import { AssigneeStack } from "@/components/shared/AssigneeStack";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { isLeadSeen, markLeadSeen } from "@/lib/seenLeads";

export const LeadRow = ({
  lead,
  users,
  onOpen,
}: {
  lead: Lead;
  users: User[];
  onOpen: (lead: Lead) => void;
}) => {
  const conversionScore = Math.min(100, Math.max(0, lead.conversionScore));
  const name = `${lead.firstName || ""} ${lead.lastName || ""}`.trim() || "—";
  const phone = lead.phone1 || "—";
  const company = lead.companyName || "—";
  const location = lead.address || "—";
  const role = lead.role || "—";
  const email = lead.email || "—";
  const category = lead.category || "—";
  const assignees = (lead.assignedTo ?? [])
    .map((id) => users.find((user) => user.id === id))
    .filter((user): user is User => Boolean(user)) as UserSummary[];
  const [seen, setSeen] = useState<boolean>(false);
  useEffect(() => {
    setSeen(isLeadSeen(lead.id));
    const handler = (e: any) => {
      if (e?.detail === lead.id) setSeen(true);
      else setSeen(isLeadSeen(lead.id));
    };
    window.addEventListener("seenLeadsChanged", handler);
    return () => window.removeEventListener("seenLeadsChanged", handler);
  }, [lead.id]);
  return (
    <TableRow>
      <TableCell className="overflow-hidden font-semibold">
        <div className="flex min-w-0 items-center gap-2">
          {!seen && (
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-full bg-primary/80"
              aria-hidden
            />
          )}
          <span className="truncate" title={name}>
            {name}
          </span>
        </div>
      </TableCell>
      <TableCell className="overflow-hidden">
        <span className="block truncate" title={phone}>{phone}</span>
      </TableCell>
      <TableCell className="overflow-hidden">
        <span className="block truncate" title={company}>{company}</span>
      </TableCell>
      <TableCell className="overflow-hidden">
        <span className="block truncate" title={location}>{location}</span>
      </TableCell>
      <TableCell className="overflow-hidden">
        <span className="block truncate" title={role}>{role}</span>
      </TableCell>
      <TableCell className="overflow-hidden">
        <span className="block truncate" title={email}>{email}</span>
      </TableCell>
      <TableCell>
        {assignees.length ? <AssigneeStack users={assignees} /> : "Unassigned"}
      </TableCell>
      <TableCell className="overflow-hidden">
        <span className="block truncate" title={category}>{category}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
            <span
              className="block h-full bg-primary"
              style={{ width: `${conversionScore}%` }}
            />
          </span>
          {conversionScore}%
        </div>
      </TableCell>
      <TableCell>
        {lead.leadSource ? (
          <span className="block max-w-full truncate rounded bg-muted px-1.5 py-1 text-[10px]" title={lead.leadSource.replace(/_/g, " ")}>
            {lead.leadSource.replace(/_/g, " ")}
          </span>
        ) : (
          "—"
        )}
      </TableCell>
      <TableCell>
        {lead.priority ? <PriorityBadge priority={lead.priority} /> : "—"}
      </TableCell>
      <TableCell>
        <button
          onClick={() => {
            markLeadSeen(lead.id);
            setSeen(true);
            onOpen(lead);
          }}
          className="rounded-full p-2 hover:bg-muted"
          aria-label={`Open ${lead.firstName || "lead"}`}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </TableCell>
    </TableRow>
  );
};

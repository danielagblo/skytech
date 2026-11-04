"use client";

import type { User, UserPerformance } from "@/types/user.types";
import { Switch } from "@/components/ui/switch";
import {
  formatCurrency,
  formatDate,
  formatDuration,
  formatRelative,
} from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const AgentTable = ({
  agents,
  performance,
  onOpen,
  onBooksAccess,
  booksAccessPendingId,
}: {
  agents: User[];
  performance: Record<string, UserPerformance | undefined>;
  onOpen: (agent: User) => void;
  onBooksAccess: (agent: User, enabled: boolean) => void;
  booksAccessPendingId?: string | null;
}) => (
  <div className="surface overflow-hidden">
    {agents.length === 0 ? (
      <EmptyState
        title="No agents yet"
        message="Create the first agent account to build your team."
      />
    ) : (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Books</TableHead>
              <TableHead>Presence</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Logged call time</TableHead>
              <TableHead>Date added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow
                key={agent.id}
                onClick={() => onOpen(agent)}
                className="cursor-pointer"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      id={agent.id}
                      name={`${agent.firstName} ${agent.lastName}`}
                      src={agent.profilePhotoUrl ?? undefined}
                      className="h-8 w-8"
                    />
                    <strong>
                      {agent.firstName} {agent.lastName}
                    </strong>
                  </div>
                </TableCell>
                <TableCell>{agent.role}</TableCell>
                <TableCell onClick={(event) => event.stopPropagation()}>
                  <Switch
                    checked={agent.role === "ADMIN" || agent.booksAccess}
                    disabled={
                      agent.role === "ADMIN" || booksAccessPendingId === agent.id
                    }
                    onCheckedChange={(enabled) => onBooksAccess(agent, enabled)}
                    aria-label={
                      agent.role === "ADMIN"
                        ? `${agent.firstName} ${agent.lastName} always has Books`
                        : `${agent.booksAccess ? "Remove" : "Assign"} Books for ${agent.firstName} ${agent.lastName}`
                    }
                  />
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${agent.presenceStatus === "ONLINE" ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    {agent.presenceStatus === "ONLINE"
                      ? "Online"
                      : agent.lastSeenAt
                        ? `Offline · seen ${formatRelative(agent.lastSeenAt)}`
                        : "Offline · never seen"}
                  </span>
                </TableCell>
                <TableCell>
                  {agent.active
                    ? agent.lastLogin
                      ? `Enabled · login ${formatRelative(agent.lastLogin)}`
                      : "Enabled · never logged in"
                    : "Disabled"}
                </TableCell>
                <TableCell>
                  {formatCurrency(performance[agent.id]?.revenue ?? 0)}
                </TableCell>
                <TableCell title="Sum of recorded deal-call durations.">
                  {formatDuration(
                    performance[agent.id]?.loggedCallSeconds ?? 0,
                  )}
                </TableCell>
                <TableCell>{formatDate(agent.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}
  </div>
);

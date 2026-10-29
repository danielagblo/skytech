"use client";
import { AlertCircle, TrendingUp } from "lucide-react";
import { useLeadStats } from "@/hooks/useLeads";
import { LeadSourceStats } from "./LeadSourceStats";
import { Skeleton } from "@/components/ui/skeleton";

export const LeadsOverview = () => {
  const stats = useLeadStats();
  if (stats.isLoading)
    return (
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-16" />
      </div>
    );
  if (stats.isError || !stats.data)
    return (
      <div className="surface flex items-center gap-3 p-4 text-sm text-danger">
        <AlertCircle className="h-5 w-5" />
        Lead statistics are temporarily unavailable. The lead table below
        remains usable.
      </div>
    );
  const counts = stats.data.countsByStatus || {};
  const cards = [
    ["New leads added", counts.NEW ?? 0],
    [
      "Waiting leads",
      (counts.CONTACTED ?? 0) + (counts.QUALIFIED ?? 0),
    ],
    ["Successful leads", counts.CONVERTED ?? 0],
    ["Lead not successful", counts.LOST ?? 0],
  ] as const;
  return (
    <div className="grid border-b bg-card xl:grid-cols-[minmax(0,1.45fr)_minmax(430px,.75fr)]">
      <div className="grid overflow-hidden sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <div
            key={label}
            className="border-b p-3 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 xl:border-b-0 xl:[&:nth-child(2)]:border-r"
          >
            <p className="eyebrow">{label}</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-2xl font-semibold">+{value}</p>
              <span className="flex items-center gap-1 bg-green-50 px-2 py-1 text-xs text-green-700">
                <TrendingUp className="h-3 w-3" />
                Live
              </span>
            </div>
          </div>
        ))}
      </div>
      <LeadSourceStats
        breakdown={stats.data.sourceBreakdown || {}}
        total={stats.data.total || 0}
      />
    </div>
  );
};

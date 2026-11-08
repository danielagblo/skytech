import { ClipboardList } from "lucide-react";
import type { ActivityStats } from "@/types/dashboard.types";

const Gauge = ({ pct }: { pct: number }) => {
  const clamped = Math.max(0, Math.min(100, pct));
  const radius = 44;
  const circumference = Math.PI * radius;
  const fill = (clamped / 100) * circumference;
  const arc = "M 16 58 A 44 44 0 0 1 104 58";
  return (
    <svg viewBox="0 0 120 64" className="h-28 w-48" aria-hidden="true">
      <path
        d={arc}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d={arc}
        fill="none"
        stroke="#8BC34A"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${fill} ${circumference}`}
      />
      <text
        x="60"
        y="48"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        className="fill-foreground"
      >
        {Math.round(clamped)}%
      </text>
      <text
        x="60"
        y="62"
        textAnchor="middle"
        fontSize="8"
        className="fill-muted-foreground"
      >
        With follow-up
      </text>
    </svg>
  );
};

export const ActivitySummary = ({ stats }: { stats: ActivityStats }) => {
  const rows = [
    ["Phone calls", stats.phoneCalls],
    ["WhatsApp", stats.whatsapp],
    ["Email", stats.email],
    ["In person", stats.inPerson],
    ["Follow-ups set", stats.followUps],
    ["Payments recorded", stats.payments],
  ] as const;
  return (
    <section className="py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-green-600" />
          <h3 className="text-base font-medium text-foreground">Recorded activity</h3>
        </div>
        <span className="text-2xl font-light tabular-nums text-foreground">
          {stats.total}
        </span>
      </div>
      <div className="grid items-center gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
        <div className="flex w-full items-center justify-center">
          <Gauge pct={stats.followUpRate} />
        </div>
        <div className="w-full space-y-1.5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center gap-3 text-muted-foreground">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="h-px flex-1 bg-border" />
              <span className="shrink-0 font-semibold tabular-nums text-foreground">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { usePresenceHeartbeat } from "@/hooks/usePresenceHeartbeat";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  usePresenceHeartbeat();
  return (
  <div className="min-h-screen bg-background text-foreground">
    <Sidebar />
    <div className="min-h-screen min-w-0 pb-20 lg:pb-0 lg:pl-28">
      <TopBar />
      <main className="min-h-[calc(100dvh-4.5rem)] min-w-0 bg-[hsl(var(--workspace))] px-3 pb-3 pt-[calc(72px+0.75rem)] sm:px-4 sm:pb-4 sm:pt-[calc(72px+1rem)] lg:min-h-[calc(100dvh-5.625rem)] lg:px-4 lg:pb-4 lg:pt-[calc(90px+1rem)] 2xl:px-5 2xl:pb-5 2xl:pt-[calc(90px+1.25rem)]">
        {children}
      </main>
    </div>
  </div>
  );
};

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
      <main className="min-h-[calc(100dvh-4.5rem)] min-w-0 bg-[hsl(var(--workspace))] px-4 pb-4 pt-[calc(72px+1rem)] sm:px-6 sm:pb-6 sm:pt-[calc(72px+1.25rem)] lg:min-h-[calc(100dvh-5.625rem)] lg:px-6 lg:pb-6 lg:pt-[calc(90px+1.5rem)] 2xl:px-8 2xl:pb-8 2xl:pt-[calc(90px+1.75rem)]">
        {children}
      </main>
    </div>
  </div>
  );
};

"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CheckCheck,
  Moon,
  Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  followUpUrgency,
  useFollowUpAlerts,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/authStore";
import { UserAvatar } from "@/components/shared/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileSheet } from "./ProfileSheet";
import { useTasks } from "@/hooks/useTasks";
import type { AppNotification, FollowUpAlert } from "@/types/notification.types";
import { cn, formatDate, formatTime } from "@/lib/utils";

const HEARD_KEY = "skytech-rung-follow-ups-v4";
const RING_MS = 10_000;

let sharedAudio: AudioContext | null = null;

function audioContext() {
  const AudioCtx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudio || sharedAudio.state === "closed") sharedAudio = new AudioCtx();
  return sharedAudio;
}

function reboundNote(context: AudioContext, start: number, frequency: number, peak: number) {
  const tone = context.createOscillator();
  const gain = context.createGain();
  tone.type = "sine";
  tone.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);
  tone.connect(gain);
  gain.connect(context.destination);
  tone.start(start);
  tone.stop(start + 0.3);
}

function playRebound() {
  const context = audioContext();
  if (!context || context.state !== "running") return false;
  const now = context.currentTime;
  reboundNote(context, now, 698, 0.72);
  reboundNote(context, now + 0.11, 880, 0.64);
  reboundNote(context, now + 0.26, 698, 0.22);
  reboundNote(context, now + 0.37, 880, 0.16);
  return true;
}

function followUpNotice(alert: FollowUpAlert): AppNotification {
  const when = `${formatDate(alert.followUpAt)} at ${formatTime(alert.followUpAt)}`;
  const title =
    alert.urgency === "DUE"
      ? "Follow-up due"
      : alert.urgency === "SIX_HOURS"
        ? "Follow-up in 6 hours"
        : "Follow-up in 1 day";
  return {
    id: `follow-up-${alert.dealId}-${alert.followUpAt}`,
    type: "FOLLOW_UP",
    title,
    body: `${alert.dealTitle} · ${when}`,
    href: `/pipeline/${alert.dealId}`,
    read: false,
    createdAt: alert.followUpAt,
  };
}

export const TopBar = () => {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const notifications = useNotifications();
  const unread = useUnreadNotificationCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const user = useAuthStore((state) => state.user);
  const overdueTasks = useTasks({ overdue: true, page: 0, size: 100 });
  const followUpAlerts = useFollowUpAlerts();
  const [now, setNow] = useState(() => Date.now());
  const [ringing, setRinging] = useState(false);
  const ringTimer = useRef<number | null>(null);
  const ringInterval = useRef<number | null>(null);
  const pendingKey = useRef<string | null>(null);
  const activeKey = useRef("");
  const liveFollowUps = (followUpAlerts.data ?? []).flatMap((alert) => {
    const urgency = followUpUrgency(alert.followUpAt, now);
    return urgency ? [{ ...alert, urgency }] : [];
  });
  const followUps = liveFollowUps.map(followUpNotice);
  const followUpKey = liveFollowUps
    .map((alert) => `${alert.dealId}|${alert.followUpAt}|${alert.urgency}`)
    .join("||");
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const id = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);
  const remember = (key: string) => {
    const ids = key.split("|").filter(Boolean);
    sessionStorage.setItem(HEARD_KEY, JSON.stringify(ids));
  };
  const stopRing = (keep: boolean) => {
    if (ringInterval.current !== null) {
      window.clearInterval(ringInterval.current);
      ringInterval.current = null;
    }
    if (ringTimer.current !== null) {
      window.clearTimeout(ringTimer.current);
      ringTimer.current = null;
    }
    if (keep && activeKey.current) remember(activeKey.current);
    if (!keep) pendingKey.current = null;
    activeKey.current = "";
    setRinging(false);
  };
  const startRing = (key: string) => {
    const context = audioContext();
    if (!context) return;
    const run = () => {
      if (context.state !== "running") {
        pendingKey.current = key;
        return;
      }
      if (ringInterval.current !== null) window.clearInterval(ringInterval.current);
      if (ringTimer.current !== null) window.clearTimeout(ringTimer.current);
      pendingKey.current = null;
      activeKey.current = key;
      setRinging(true);
      playRebound();
      ringInterval.current = window.setInterval(() => {
        if (!playRebound()) pendingKey.current = key;
      }, 1400);
      ringTimer.current = window.setTimeout(() => stopRing(true), RING_MS);
    };
    if (context.state === "suspended") {
      pendingKey.current = key;
      void context.resume().then(run);
      return;
    }
    run();
  };
  useEffect(() => {
    const unlock = () => {
      const context = audioContext();
      if (!context) return;
      void context.resume().then(() => {
        const waiting = pendingKey.current;
        if (!waiting || context.state !== "running") return;
        pendingKey.current = null;
        startRing(waiting);
      });
    };
    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);
    return () => {
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
    };
  }, []);
  useEffect(() => {
    if (!followUpKey) return;
    let heard = new Set<string>();
    try {
      const stored = JSON.parse(sessionStorage.getItem(HEARD_KEY) || "[]");
      if (Array.isArray(stored)) heard = new Set(stored.filter((id) => typeof id === "string"));
    } catch {
      heard = new Set();
    }
    const fresh = followUpKey.split("|").filter((id) => id && !heard.has(id));
    if (!fresh.length) return;
    startRing(followUpKey);
    return () => stopRing(false);
  }, [followUpKey]);
  const unresolvedOverdue: AppNotification[] = (
    overdueTasks.data?.content ?? []
  )
    .filter(
      (task) =>
        task.status !== "DONE" &&
        !task.completionReason?.trim() &&
        Boolean(user?.id && task.assigneeIds.includes(user.id)),
    )
    .map((task) => ({
      id: `overdue-task-${task.id}`,
      type: "OVERDUE_TASK_REASON_REQUIRED",
      title: "Overdue task needs a reason",
      body: `${task.title} — close it and record why it was not completed on time.`,
      href: `/tasks?open=${task.id}&reason=1`,
      read: false,
      createdAt: task.dueDate ?? task.updatedAt,
    }));
  const list = [...followUps, ...unresolvedOverdue, ...(notifications.data ?? [])];
  const unreadCount = (unread.data ?? 0) + unresolvedOverdue.length + followUps.length;
  const name = user ? `${user.firstName} ${user.lastName}` : "Loading profile";
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 flex h-[72px] items-center border-b bg-background/95 backdrop-blur lg:left-28 lg:h-[90px]">
        <div className="flex h-full min-w-0 flex-1 items-center lg:flex-none">
          <div className="flex h-full min-w-0 flex-1 items-center border-r px-4 lg:w-[270px] lg:flex-none">
            <h1 className="truncate text-xl font-light tracking-tight text-muted-foreground sm:text-2xl lg:text-[27px]">
              Systems Aisle
            </h1>
          </div>
          <div className="hidden h-full items-center gap-8 px-8 sm:flex">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => router.forward()}
              className="rounded-full p-2 transition hover:bg-muted"
              aria-label="Go forward"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1 pr-3 sm:gap-3 sm:pr-5">
          <button
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
          >
            <Sun className="hidden h-5 w-5 dark:block" />
            <Moon className="h-5 w-5 dark:hidden" />
          </button>
          <DropdownMenu
            onOpenChange={(open) => {
              if (open) stopRing(true);
            }}
          >
            <DropdownMenuTrigger asChild>
              <button
                className="relative rounded-full p-2 hover:bg-muted"
                aria-label="Notifications"
              >
                <span
                  className={cn(
                    "inline-flex origin-top",
                    ringing && "bell-shake text-amber-600",
                  )}
                >
                  <Bell className="h-5 w-5" />
                </span>
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-background" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2">
              <div className="flex items-center justify-between px-2 py-2">
                <strong>Notifications</strong>
                <button
                  className="flex items-center gap-1 text-xs text-green-700"
                  onClick={() => markAllRead.mutate()}
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark read
                </button>
              </div>
              {list.length === 0 ? (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  You are all caught up.
                </p>
              ) : (
                list.slice(0, 8).map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    className="block cursor-pointer"
                    onSelect={() => {
                      if (
                        !item.read &&
                        !item.id.startsWith("overdue-task-") &&
                        !item.id.startsWith("follow-up-")
                      )
                        markRead.mutate(item.id);
                      if (item.href) router.push(item.href);
                    }}
                  >
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.body}
                    </p>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-3 rounded-full p-1 pr-2 text-left transition hover:bg-muted"
            aria-label="Open profile"
          >
            <UserAvatar
              id={user?.id}
              name={name}
              src={user?.profilePhotoUrl ?? undefined}
              className="h-10 w-10 ring-2 ring-cyan-400 sm:h-12 sm:w-12"
            />
            <span className="hidden leading-tight md:block">
              <span className="block text-sm font-medium">{name}</span>
              <span className="block text-[10px] text-muted-foreground">
                {user?.role ? user.role.replace("_", " ") : "—"}
              </span>
            </span>
          </button>
        </div>
      </header>
      <ProfileSheet open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
};

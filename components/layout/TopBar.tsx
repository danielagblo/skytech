"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
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
import { useQueryClient } from "@tanstack/react-query";
import {
  followUpUrgency,
  useFollowUpAlerts,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/hooks/useNotifications";
import { notificationsService } from "@/services/notifications.service";
import { useAuthStore } from "@/store/authStore";
import { UserAvatar } from "@/components/shared/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileSheet } from "./ProfileSheet";
import { useTasks } from "@/hooks/useTasks";
import type { AppNotification, FollowUpAlert } from "@/types/notification.types";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { notificationAudio, playNotificationTone, readNotificationRepeats } from "@/lib/notification-tones";

const HEARD_KEY = "skytech-rung-follow-ups-v7";
const DISMISSED_KEY = "skytech-dismissed-notifications";
const CHIME_GAP_MS = 780;
const REMOVE_WIDTH = 88;

function readDismissed() {
  try {
    const stored = JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]");
    return Array.isArray(stored)
      ? stored.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function SwipeNotification({
  item,
  onOpen,
  onRemove,
}: {
  item: AppNotification;
  onOpen: () => void;
  onRemove: () => void;
}) {
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const startOffset = useRef(0);
  const dragging = useRef(false);
  const axis = useRef<"x" | "y" | null>(null);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    dragging.current = true;
    axis.current = null;
    startX.current = event.clientX;
    startY.current = event.clientY;
    startOffset.current = offset;
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = event.clientX - startX.current;
    const dy = event.clientY - startY.current;
    if (!axis.current) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      axis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (axis.current === "x") event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (axis.current !== "x") return;
    setOffset(Math.min(0, Math.max(-REMOVE_WIDTH, startOffset.current + dx)));
  };
  const finish = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (axis.current === "x") {
      setOffset((current) => (current <= -REMOVE_WIDTH / 2 ? -REMOVE_WIDTH : 0));
    }
  };

  return (
    <div className="relative overflow-hidden rounded-md">
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex w-[88px] items-center justify-center bg-danger text-xs font-semibold text-white"
        onClick={onRemove}
      >
        Remove
      </button>
      <div
        className="relative cursor-pointer bg-background px-3 py-2 text-sm hover:bg-muted"
        style={{ transform: `translateX(${offset}px)`, touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finish}
        onPointerCancel={finish}
        onClick={() => {
          if (axis.current === "x") return;
          onOpen();
        }}
      >
        <p className="font-medium">{item.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{item.body}</p>
        <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
          Slide to remove
        </p>
      </div>
    </div>
  );
}

function audioContext() {
  return notificationAudio();
}

function playChime() {
  return playNotificationTone();
}

function pipelineOfferPath(href: string) {
  const path = href.split("?")[0].replace(/\/$/, "");
  const match = path.match(/^(?:\/crm)?\/pipeline\/([^/]+)$/);
  if (!match) return null;
  const onCrm =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/crm");
  const prefix = onCrm || path.startsWith("/crm") ? "/crm" : "";
  return `${prefix}/pipeline?offer=${encodeURIComponent(match[1])}`;
}

function overdueLabel(followUpAt: string) {
  const late = Date.now() - new Date(followUpAt).getTime();
  const minutes = Math.max(1, Math.floor(late / 60000));
  if (minutes < 60) return `${minutes} min overdue`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours} hr overdue`;
  return `${Math.floor(hours / 24)} days overdue`;
}

function followUpNotice(alert: FollowUpAlert): AppNotification {
  const when = `${formatDate(alert.followUpAt)} at ${formatTime(alert.followUpAt)}`;
  const overdue = alert.urgency === "DUE";
  const title = overdue
    ? "Follow-up overdue"
    : alert.urgency === "TEN_MINUTES"
      ? "Follow-up in 10 minutes"
      : "Follow-up in 1 hour";
  return {
    id: `follow-up-${alert.dealId}-${alert.followUpAt}-${alert.urgency}`,
    type: "FOLLOW_UP",
    title,
    body: overdue
      ? `${alert.dealTitle} · ${overdueLabel(alert.followUpAt)}`
      : `${alert.dealTitle} · ${when}`,
    href: `/pipeline/${alert.dealId}`,
    read: false,
    createdAt: alert.followUpAt,
  };
}

export const TopBar = () => {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const client = useQueryClient();
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
  const pendingKey = useRef<string | null>(null);
  const activeKey = useRef("");
  useEffect(() => {
    setDismissed(readDismissed());
  }, []);
  const dismissedSet = new Set(dismissed);
  const liveFollowUps = (followUpAlerts.data ?? []).flatMap((alert) => {
    const urgency = followUpUrgency(alert.followUpAt, now);
    if (!urgency) return [];
    if (dismissedSet.has(`follow-up-${alert.dealId}-${alert.followUpAt}-${urgency}`)) return [];
    return [{ ...alert, urgency }];
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
      if (ringTimer.current !== null) window.clearTimeout(ringTimer.current);
      pendingKey.current = null;
      activeKey.current = key;
      setRinging(true);
      let played = 0;
      const repeats = readNotificationRepeats();
      const strike = () => {
        if (!playChime()) {
          pendingKey.current = key;
          return;
        }
        played += 1;
        ringTimer.current = window.setTimeout(
          () => (played >= repeats ? stopRing(true) : strike()),
          played >= repeats ? 900 : CHIME_GAP_MS,
        );
      };
      strike();
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
        Boolean(user?.id && task.assigneeIds.includes(user.id)) &&
        !dismissedSet.has(`overdue-task-${task.id}`),
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
  const list = [
    ...followUps,
    ...unresolvedOverdue,
    ...(notifications.data ?? []).filter((item) => !dismissedSet.has(item.id)),
  ];
  const dismiss = (item: AppNotification) => {
    setDismissed((current) => {
      const next = current.includes(item.id) ? current : [...current, item.id];
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
      return next;
    });
    const stored =
      !item.id.startsWith("follow-up-") && !item.id.startsWith("overdue-task-");
    if (stored && !item.read) {
      void notificationsService.markRead(item.id).finally(() => {
        void client.invalidateQueries({ queryKey: ["notifications"] });
      });
    }
  };
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
            modal={false}
            open={menuOpen}
            onOpenChange={(open) => {
              setMenuOpen(open);
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
                <div
                  className="max-h-[min(22rem,calc(100vh-8rem))] space-y-1 overflow-y-auto overscroll-contain"
                  onWheel={(event) => event.stopPropagation()}
                >
                  {list.map((item) => (
                    <SwipeNotification
                      key={item.id}
                      item={item}
                      onOpen={() => {
                        if (
                          !item.read &&
                          !item.id.startsWith("overdue-task-") &&
                          !item.id.startsWith("follow-up-")
                        )
                          markRead.mutate(item.id);
                        setMenuOpen(false);
                        if (item.href) {
                          router.push(pipelineOfferPath(item.href) ?? item.href);
                        }
                      }}
                      onRemove={() => dismiss(item)}
                    />
                  ))}
                </div>
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

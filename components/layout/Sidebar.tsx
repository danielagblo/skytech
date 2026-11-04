"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  GitBranch,
  Home,
  ListTodo,
  LogOut,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/useAuth";
import { usePermission, type Permission } from "@/hooks/usePermission";
import { useAuthStore } from "@/store/authStore";

const nav: Array<{
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: Permission;
}> = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/pipeline", label: "Pipeline", icon: GitBranch },
  { href: "/books", label: "Books", icon: Wallet },
  { href: "/tasks", label: "Task Bar", icon: ListTodo },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    permission: "view:settings",
  },
];

const isActive = (path: string, href: string) =>
  path === href ||
  path === `/crm${href}` ||
  path.startsWith(`${href}/`) ||
  path.startsWith(`/crm${href}/`);

const itemHref = (path: string, href: string) =>
  path.startsWith("/crm") ? `/crm${href}` : href;

const itemClass = (active: boolean) =>
  cn(
    "group flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-0.5 text-center text-[10px] leading-tight text-muted-foreground transition-colors hover:bg-primary/15 hover:text-foreground",
    active && "bg-primary/65 text-foreground",
  );

export const Sidebar = () => {
  const path = usePathname();
  const { logout, isPending } = useLogout();
  const { can } = usePermission();
  const user = useAuthStore((state) => state.user);
  const canOpenBooks = user?.role === "ADMIN" || user?.booksAccess === true;
  const available = nav.filter((item) => {
    if (item.href === "/books") return canOpenBooks;
    return !item.permission || can(item.permission);
  });
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-28 flex-col border-r bg-card lg:flex">
        <div className="flex h-[90px] shrink-0 items-center justify-center border-b">
          <img
            src="/assets/skytech_Logo.png"
            alt="Skytech"
            className="h-12 w-12 rounded-xl object-contain"
          />
        </div>
        <nav className="flex min-h-0 flex-1 flex-col">
          {available.map((item) => {
            const active = isActive(path, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={itemHref(path, item.href)}
                aria-current={active ? "page" : undefined}
                className={itemClass(active)}
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          disabled={isPending}
          className="flex h-16 shrink-0 flex-col items-center justify-center gap-1 border-t bg-card text-[10px] leading-tight text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
        >
          <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.75} />
          <span>{isPending ? "Signing out…" : "Logout"}</span>
        </button>
      </aside>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid h-[4.75rem] border-t bg-card/95 shadow-[0_-8px_30px_rgba(15,23,42,.08)] backdrop-blur lg:hidden"
        style={{
          gridTemplateColumns: `repeat(${available.length + 1}, minmax(0, 1fr))`,
        }}
      >
        {available.map((item) => {
          const active = isActive(path, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={itemHref(path, item.href)}
              aria-current={active ? "page" : undefined}
              className={cn(
                itemClass(active),
                "relative h-full",
                active &&
                  "after:absolute after:inset-x-3 after:top-0 after:h-1 after:rounded-b-full after:bg-primary",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
              <span className="w-full">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={logout}
          disabled={isPending}
          className="flex min-w-0 flex-col items-center justify-center gap-1 border-l px-0.5 text-center text-[10px] leading-tight text-muted-foreground disabled:opacity-50"
        >
          <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.75} />
          <span className="w-full">{isPending ? "…" : "Logout"}</span>
        </button>
      </nav>
    </>
  );
};

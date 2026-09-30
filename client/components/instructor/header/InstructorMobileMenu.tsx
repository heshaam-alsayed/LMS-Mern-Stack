"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LogOut,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  User,
  X,
  type LucideIcon,
} from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import { getShortName } from "@/app/utils/helper";
import { useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/utils";

import { handleInstructorLogout } from "./instructorLogout";

export type InstructorNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

type NavGroup = {
  title: string;
  items: InstructorNavItem[];
};

type InstructorMobileMenuProps = {
  dashboardItem: InstructorNavItem;
  contentItems: InstructorNavItem[];
  manageItems: InstructorNavItem[];
  analyticsItems: InstructorNavItem[];
  accountItems: InstructorNavItem[];
};

export function InstructorMobileMenu({
  dashboardItem,
  contentItems,
  manageItems,
  analyticsItems,
  accountItems,
}: InstructorMobileMenuProps) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const user = useAppSelector((state) => state.auth.user);

  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const groups: NavGroup[] = [
    { title: "Main", items: [dashboardItem] },
    { title: "Content", items: contentItems },
    { title: "Manage", items: manageItems },
    { title: "Analytics", items: analyticsItems },
    { title: "Account", items: accountItems },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden">
          <Menu className="size-5" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full max-w-[85vw] gap-0 overflow-y-auto p-0 sm:max-w-[320px]">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="sr-only">Instructor menu</SheetTitle>

          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              Menu
            </span>

            <SheetClose asChild>
              <Button type="button" variant="ghost" size="icon-sm">
                <X className="size-4" />

                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="size-11 border border-border bg-muted/40">
              {user?.avatar?.url ? (
                <AvatarImage
                  src={user.avatar.url}
                  alt={user.name}
                  className="object-contain"
                />
              ) : null}

              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {user?.name ? (
                  getShortName(user.name)
                ) : (
                  <User className="h-5 w-5" />
                )}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.name || "Instructor"}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {user?.email || "No email"}
              </p>

              <div className="mt-1 flex items-center gap-1 text-[10px] font-medium capitalize text-muted-foreground">
                <ShieldCheck className="size-3 w-3" />
                {user?.role || "instructor"}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
              {isDark ? (
                <Moon className="size-3.5 w-3.5" />
              ) : (
                <Sun className="size-3.5 w-3.5" />
              )}

              Dark Mode
            </div>

            <Switch
              checked={isDark}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
              aria-label="Toggle dark mode"
            />
          </div>
        </SheetHeader>

        <nav className="flex flex-col gap-5 p-4">
          {groups.map((group, groupIndex) => (
            <div
              key={group.title}
              className="animate-in fade-in-0 slide-in-from-right-3 space-y-1 duration-300 fill-mode-backwards"
              style={{ animationDelay: `${groupIndex * 60}ms` }}>
              <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {group.title}
              </p>

              {group.items.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted",
                    )}>
                    <item.icon
                      className={cn(
                        "size-3.5 w-3.5 shrink-0",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                    />

                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          <div
            className="animate-in fade-in-0 slide-in-from-right-3 space-y-1 border-t border-border pt-4 duration-300 fill-mode-backwards"
            style={{ animationDelay: `${groups.length * 60}ms` }}>
            <button
              type="button"
              onClick={() => {
                setOpen(false);

                void handleInstructorLogout();
              }}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10">
              <LogOut className="size-3.5 w-3.5 shrink-0" />

              Sign out
            </button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  KeyRound,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getShortName } from "@/app/utils/helper";
import { useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/utils";

import { handleInstructorLogout } from "./instructorLogout";
import type { InstructorNavItem } from "./InstructorMobileMenu";

export const ACCOUNT_ITEMS: InstructorNavItem[] = [
  {
    label: "Profile",
    description: "Photo and personal details",
    href: "/instructor/account/profile",
    icon: User,
  },
  {
    label: "Security",
    description: "Change your password",
    href: "/instructor/account/security",
    icon: KeyRound,
  },
];

export function InstructorAccountMenu() {
  const pathname = usePathname();

  const user = useAppSelector((state) => state.auth.user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className="flex items-center gap-2 rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/40">
          <Avatar className="size-9 border border-border bg-muted/40">
            {user?.avatar?.url ? (
              <AvatarImage
                src={user.avatar.url}
                alt={user.name}
                className="object-contain"
              />
            ) : null}

            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {user?.name ? (
                getShortName(user.name)
              ) : (
                <User className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>

          <span className="hidden max-w-[140px] truncate text-sm font-medium text-foreground xl:inline">
            {user?.name || "Account"}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-60 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-background p-1 shadow-lg duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
        <div className="mb-1 rounded-lg bg-muted/40 px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-9 shrink-0 border border-border bg-muted/40">
              {user?.avatar?.url ? (
                <AvatarImage
                  src={user.avatar.url}
                  alt={user.name}
                  className="object-contain"
                />
              ) : null}

              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {user?.name ? (
                  getShortName(user.name)
                ) : (
                  <User className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {user?.name || "Instructor"}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                {user?.email || "No email"}
              </p>

              <div className="mt-1 flex items-center gap-1 text-[9px] font-medium capitalize text-muted-foreground">
                <ShieldCheck className="h-2.5 w-2.5" />
                {user?.role || "instructor"}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-0.5">
          {ACCOUNT_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <DropdownMenuItem
                key={item.href}
                asChild
                className={cn(
                  "group cursor-pointer rounded-lg p-0 outline-none",
                  "focus:bg-transparent",
                )}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2",
                    "transition-colors",
                    "hover:bg-muted",
                    isActive && "bg-muted",
                  )}>
                  <div
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-lg",
                      "bg-muted transition-colors",
                      "group-hover:bg-background",
                      isActive && "bg-background",
                    )}>
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground">
                      {item.label}
                    </p>

                    <p className="truncate text-[10px] text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator className="my-1 bg-border/60" />

        <DropdownMenuItem
          className="group cursor-pointer rounded-lg p-0 outline-none focus:bg-transparent"
          onClick={() => void handleInstructorLogout()}>
          <div className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-red-500/10">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
              <LogOut className="h-3.5 w-3.5 text-red-500" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-red-500">Sign out</p>

              <p className="text-[10px] text-muted-foreground">
                Sign out of your account
              </p>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

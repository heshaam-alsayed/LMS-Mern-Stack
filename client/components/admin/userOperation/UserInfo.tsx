"use client";

import { IAdminUser } from "@/types/operation.type";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  ShieldCheck,
  UserRound,
  BookOpen,
  UserCircle2,
} from "lucide-react";
import Image from "next/image";

interface UserInfoProps {
  user: IAdminUser | undefined;
}

export default function UserInfo({ user }: UserInfoProps) {
  if (!user) return;
  const createdDate = new Date(user?.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const updatedDate = new Date(user?.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
    <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
          <UserCircle2 className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            User Information
          </h2>

          <p className="text-sm text-muted-foreground">
            Personal information, account status, role, and account activity
          </p>
        </div>
      </div>
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-card">
      <div className="relative p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative shrink-0">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border border-border bg-muted shadow-sm sm:h-24 sm:w-24">
                {user?.avatar?.url ? (
                  <Image
                    src={
                      user.avatar.url ||
                      "/user-profile-icon-flat-style-600nw-2748799073.webp"
                    }
                    alt={user.name}
                    className="h-full w-full object-cover"
                    width={100}
                    height={80}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                    <UserRound className="h-9 w-9" />
                  </div>
                )}
              </div>

              {user?.isVerified && (
                <div className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border-4 border-card bg-emerald-500 text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {user?.name}
                </h1>

                {user?.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>

              <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {user?.role}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${
                    user?.isDeleted
                      ? "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  }`}>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      user?.isDeleted ? "bg-red-500" : "bg-emerald-500"
                    }`}
                  />
                  {user?.isDeleted ? "Deleted" : "Active"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs font-medium">Courses</span>
              </div>

              <p className="mt-1 text-lg font-semibold text-foreground">
                {user?.courses?.length ?? 0}
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span className="text-xs font-medium">Joined</span>
              </div>

              <p className="mt-1 text-sm font-semibold text-foreground">
                {createdDate}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 border-t border-border/60 pt-5 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-muted/30 px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarDays className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Account Created</p>

              <p className="truncate text-sm font-medium text-foreground">
                {createdDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-muted/30 px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock3 className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Last Updated</p>

              <p className="truncate text-sm font-medium text-foreground">
                {updatedDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}

"use client";

import { Bell } from "lucide-react";

import NotificationsFilters from "./NotificationsFilters";

type Props = {
  total: number;
  status: string;
  limit: string;
  onChange: (key: string, value: string) => void;
};

export default function NotificationsHeader({
  total,
  status,
  limit,
  onChange,
}: Props) {
  return (
    <div className="relative mb-4 w-full overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative flex w-full flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <div className="flex min-w-0 items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Notifications Data
              </h1>

              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {total.toLocaleString()}
              </span>
            </div>

            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
              View all system notifications and manage their status.
            </p>
          </div>
        </div>

        <NotificationsFilters
          status={status}
          limit={limit}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

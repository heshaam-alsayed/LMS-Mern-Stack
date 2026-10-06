"use client";

import { Bell } from "lucide-react";

export default function NotificationsEmptyState() {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Bell className="h-7 w-7" />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-foreground">
        No notifications found
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        There are no notifications to display. New notifications will appear
        here as soon as they are created.
      </p>
    </div>
  );
}

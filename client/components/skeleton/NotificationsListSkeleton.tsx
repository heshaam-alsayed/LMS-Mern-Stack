"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-4 rounded-xl border border-border bg-background p-3 sm:p-5">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <Skeleton className="h-5 w-2/3 max-w-[420px]" />

              <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
            </div>

            <Skeleton className="mt-3 h-4 w-full" />

            <Skeleton className="mt-2 h-4 w-5/6" />

            <Skeleton className="mt-3 h-3 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}
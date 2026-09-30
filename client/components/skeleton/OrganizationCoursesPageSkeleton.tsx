"use client";

import { Skeleton } from "@/components/ui/skeleton";
import OrganizationCoursesTableSkeleton from "./OrganizationCoursesTableSkeleton";

export default function OrganizationCoursesPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-background p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />

              <Skeleton className="h-7 w-[280px]" />

              <Skeleton className="h-3 w-[360px]" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
              <Skeleton className="h-3 w-[60px]" />

              <Skeleton className="mt-2 h-6 w-[40px]" />
            </div>

            <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
              <Skeleton className="h-3 w-[72px]" />

              <Skeleton className="mt-2 h-6 w-[40px]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-full sm:w-[340px]" />

        <Skeleton className="h-10 w-full sm:w-[120px]" />
      </div>

      <div className="w-full overflow-hidden rounded-xl border bg-background shadow-sm">
        <OrganizationCoursesTableSkeleton />
      </div>
    </div>
  );
}

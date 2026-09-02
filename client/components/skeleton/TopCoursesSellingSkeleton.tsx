import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function TopCoursesSellingSkeleton() {
  return (
    <div>
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="h-7 w-7 shrink-0 rounded-full" />

            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-3/4" />

              <Skeleton className="mt-1.5 h-3 w-24" />
            </div>

            <div className="flex shrink-0 flex-col items-end">
              <Skeleton className="h-4 w-10" />

              <Skeleton className="mt-1.5 h-3 w-8" />
            </div>

            <div className="hidden w-24 flex-col items-end sm:flex">
              <Skeleton className="h-4 w-16" />

              <Skeleton className="mt-1.5 h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

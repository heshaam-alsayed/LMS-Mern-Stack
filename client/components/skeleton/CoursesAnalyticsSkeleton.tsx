"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesAnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-3">
          <Skeleton className="h-8 w-56 sm:h-9" />

          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-3/4 max-w-md" />
        </div>

        <Skeleton className="h-10 w-full sm:w-[140px]" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="
              rounded-xl
              border
              border-border
              bg-card
              p-5
            "
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-10 rounded-lg" />

              <Skeleton className="h-8 w-14" />
            </div>

            <div className="mt-5 space-y-2">
              <Skeleton className="h-4 w-28" />

              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        ))}
      </div>

      <div
        className="
          rounded-xl
          border
          border-border
          bg-card
          p-6
        "
      >
        <div className="space-y-2">
          <Skeleton className="h-5 w-56" />

          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        <div className="mt-8">
          <div className="flex h-[320px] items-end gap-3">
            <div className="flex h-full w-8 flex-col justify-between py-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-3 w-6"
                />
              ))}
            </div>

            <div className="relative flex h-full flex-1 flex-col justify-between">
              <div className="absolute inset-0 flex flex-col justify-between">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-px w-full"
                  />
                ))}
              </div>

              <div className="relative z-10 flex h-full items-center justify-around">
                {Array.from({ length: 12 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-2.5 w-2.5 rounded-full"
                  />
                ))}
              </div>

              <div className="flex justify-between pt-3">
                {Array.from({ length: 12 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-3 w-6"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
          <Skeleton className="h-8 w-8 rounded-lg" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
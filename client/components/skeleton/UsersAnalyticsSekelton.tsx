"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function UsersAnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-[420px] max-w-full" />
        </div>

        <Skeleton className="h-10 w-[120px] rounded-md" />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>

              <Skeleton className="h-11 w-11 rounded-lg" />
            </div>

            <div className="mt-4">
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl border bg-card">
        {/* Chart Header */}
        <div className="space-y-2 p-6 pb-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Chart Content */}
        <div className="px-6 pb-6">
          <div className="relative h-[300px] w-full">
            {/* Horizontal grid lines */}
            <div className="absolute inset-x-0 top-0 space-y-[59px]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-px w-full"
                />
              ))}
            </div>

            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-around gap-4 px-8 pb-8 pt-6">
              {Array.from({ length: 12 }).map((_, index) => {
                const heights = [
                  "h-[80px]",
                  "h-[120px]",
                  "h-[95px]",
                  "h-[160px]",
                  "h-[130px]",
                  "h-[190px]",
                  "h-[145px]",
                  "h-[220px]",
                  "h-[175px]",
                  "h-[200px]",
                  "h-[150px]",
                  "h-[230px]",
                ];

                return (
                  <div
                    key={index}
                    className="flex h-full flex-1 items-end justify-center"
                  >
                    <Skeleton
                      className={`w-full max-w-[45px] rounded-t-md ${heights[index]}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* X Axis */}
            <div className="absolute inset-x-8 bottom-0 flex justify-around gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-3 w-7"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Chart Footer */}
        <div className="flex flex-col gap-2 border-t px-6 py-4">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-3 w-64" />
        </div>
      </div>
    </div>
  );
}
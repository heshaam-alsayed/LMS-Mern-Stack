"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersAnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />

          <Skeleton className="h-4 w-[420px] max-w-full" />
        </div>

        <Skeleton className="h-10 w-[130px]" />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-10 rounded-lg" />

                <Skeleton className="h-8 w-20" />
              </div>

              {/* Content */}
              <div className="mt-5 space-y-2">
                <Skeleton className="h-4 w-24" />

                <Skeleton className="h-3 w-36" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Orders Chart */}
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-52" />

          <Skeleton className="h-4 w-72 max-w-full" />
        </CardHeader>

        <CardContent>
          <div className="h-[300px] w-full">
            <div className="flex h-full items-end justify-between gap-3 px-4 pb-6">
              {Array.from({ length: 12 }).map((_, index) => {
                const heights = [
                  "h-20",
                  "h-32",
                  "h-24",
                  "h-44",
                  "h-28",
                  "h-36",
                  "h-52",
                  "h-40",
                  "h-24",
                  "h-48",
                  "h-32",
                  "h-56",
                ];

                return (
                  <div
                    key={index}
                    className="flex h-full flex-1 flex-col justify-end gap-3">
                    <Skeleton
                      className={`w-full rounded-t-md ${heights[index]}`}
                    />

                    <Skeleton className="mx-auto h-3 w-8" />
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>

        {/* Chart Footer */}
        <div className="border-t border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

"use client"
import { Skeleton } from "../ui/skeleton";

export default function OrdersRevenueSkeleton() {
  return (
    <div className="space-y-4">
      {/* Y Axis Skeleton */}
      <div className="flex min-h-[320px] gap-4">
        <div className="flex w-10 flex-col justify-between py-3">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-3 w-8" />
        </div>

        {/* Chart Skeleton */}
        <div className="relative flex-1 overflow-hidden rounded-lg">
          <div className="absolute inset-0 flex flex-col justify-between">
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-px w-full" />
          </div>

          {/* Fake Area */}
          <div className="absolute bottom-0 left-0 right-0 h-[65%]">
            <Skeleton className="h-full w-full rounded-none opacity-50" />
          </div>
        </div>
      </div>

      {/* X Axis Skeleton */}
      <div className="grid grid-cols-6 gap-3 px-8 sm:grid-cols-12">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="mx-auto h-3 w-7" />
        ))}
      </div>
    </div>
  );
}

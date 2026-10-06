"use client";

import { Skeleton } from "@/components/ui/skeleton";

import InstructorCoursePerformanceSkeleton from "./InstructorCoursePerformanceSkeleton";
import RecentActivityPanelSkeleton from "./recentActivity/RecentActivityPanelSkeleton";

export default function InstructorDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-8 w-56 sm:h-9" />

        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="
              rounded-xl
              border
              border-border
              bg-card
              p-5
            ">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-10 rounded-lg" />

              <Skeleton className="h-8 w-16" />
            </div>

            <div className="mt-5 space-y-2">
              <Skeleton className="h-4 w-28" />

              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        ))}
      </div>

      <InstructorCoursePerformanceSkeleton />

      <section className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />

          <Skeleton className="h-4 w-80" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <RecentActivityPanelSkeleton />

          <RecentActivityPanelSkeleton />
        </div>
      </section>
    </div>
  );
}

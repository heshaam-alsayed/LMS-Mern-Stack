import { Skeleton } from "../ui/skeleton";
import OrdersRevenueSkeleton from "./OrdersRevenueSkeleton";
import GrowthCardSkeleton from "./GrowthCardSkeleton";
import TopCoursesSellingSkeleton from "./TopCoursesSellingSkeleton";

export default function DashboardSkeleton() {
  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="min-w-0 w-full lg:w-[70%]">
          <div className="space-y-4 rounded-xl border bg-background p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-3 w-64 max-w-full" />
              </div>

              <Skeleton className="h-9 w-32" />
            </div>

            <OrdersRevenueSkeleton />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-[30%]">
          <GrowthCardSkeleton />

          <GrowthCardSkeleton />
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col gap-4 lg:flex-row">
        <div className="flex min-w-0 w-full lg:w-[60%]">
          <div className="w-full rounded-xl border bg-background">
            <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
              <Skeleton className="h-5 w-40" />

              <Skeleton className="h-9 w-28" />
            </div>

            <TopCoursesSellingSkeleton />
          </div>
        </div>

        <div className="flex w-full lg:w-[40%]">
          <div className="w-full rounded-xl border bg-background p-4">
            <Skeleton className="h-5 w-36" />

            <div className="mt-4 space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-4 w-2/5" />

                    <Skeleton className="h-4 w-14" />
                  </div>

                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
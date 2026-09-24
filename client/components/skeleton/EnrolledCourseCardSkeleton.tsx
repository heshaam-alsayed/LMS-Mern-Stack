import { Skeleton } from "@/components/ui/skeleton";

interface EnrolledCourseCardSkeletonProps {
  count?: number;
}

export default function EnrolledCourseCardSkeleton({
  count = 6,
}: EnrolledCourseCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <Skeleton className="aspect-video w-full rounded-none" />

          <div className="space-y-5 p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24 rounded-md" />

                <Skeleton className="h-5 w-12" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />

                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />

                <Skeleton className="h-4 w-10" />
              </div>

              <Skeleton className="h-2 w-full" />

              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-36" />

                <Skeleton className="h-3 w-16" />
              </div>
            </div>

            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
}

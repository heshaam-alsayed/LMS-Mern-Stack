import { Skeleton } from "@/components/ui/skeleton";

export default function InstructorCoursePerformanceSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-11 w-11 rounded-xl" />

        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-72" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background">
        <div className="border-b border-border px-6 py-4">
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-6 py-5"
            >
              <Skeleton className="h-4 flex-1" />

              <Skeleton className="h-4 w-12" />

              <Skeleton className="h-4 w-16" />

              <Skeleton className="h-4 w-12" />

              <Skeleton className="h-2 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

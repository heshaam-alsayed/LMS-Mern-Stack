import { Skeleton } from "@/components/ui/skeleton";

export default function OrganizationDetailsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />

        <div>
          <Skeleton className="h-5 w-[220px]" />

          <Skeleton className="mt-2 h-3 w-[280px]" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 rounded-xl border bg-background p-5 lg:col-span-2">
          <Skeleton className="h-5 w-40" />

          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />

            <Skeleton className="h-4 w-[85%]" />

            <Skeleton className="h-4 w-[60%]" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-16 w-full" />

            <Skeleton className="h-16 w-full" />
          </div>
        </div>

        <div className="space-y-4 rounded-xl border bg-background p-5">
          <Skeleton className="h-5 w-32" />

          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />

            <div className="flex-1">
              <Skeleton className="h-4 w-[130px]" />

              <Skeleton className="mt-2 h-3 w-[170px]" />
            </div>
          </div>

          <Skeleton className="h-16 w-full" />
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />

        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-[180px]" />

          <Skeleton className="h-10 w-[180px]" />

          <Skeleton className="h-10 w-[180px]" />

          <Skeleton className="h-10 w-[300px]" />
        </div>
      </div>
    </div>
  );
}

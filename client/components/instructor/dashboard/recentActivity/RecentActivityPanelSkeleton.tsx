import { Skeleton } from "@/components/ui/skeleton";

export default function RecentActivityPanelSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm">
      <div className="flex items-center gap-3 border-b border-border bg-muted/20 px-6 py-4">
        <Skeleton className="h-9 w-9 rounded-xl" />

        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>

        <Skeleton className="h-8 w-[104px] rounded-md" />
      </div>

      <div className="divide-y divide-border">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 px-6 py-4">
            <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>

            <Skeleton className="h-4 w-12 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

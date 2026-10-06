import { Skeleton } from "@/components/ui/skeleton";

export default function TicketDetailsSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b bg-background">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <div className="flex items-center gap-3 py-3">
            <Skeleton className="size-9 rounded-lg" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />

              <Skeleton className="h-3 w-24" />
            </div>

            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          <div className="flex items-center justify-between gap-4 border-t py-2.5">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-8 rounded-full" />

              <Skeleton className="h-7 w-24" />
            </div>

            <div className="flex items-center gap-2.5">
              <Skeleton className="size-8 rounded-full" />

              <Skeleton className="h-7 w-24" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 py-5">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
          <div className="flex justify-start">
            <Skeleton className="h-20 w-2/3 rounded-2xl" />
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-16 w-1/2 rounded-2xl" />
          </div>

          <div className="flex justify-start">
            <Skeleton className="h-24 w-3/4 rounded-2xl" />
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t bg-background px-4 py-3">
        <div className="mx-auto flex w-full max-w-3xl items-end gap-2">
          <Skeleton className="size-9 rounded-lg" />

          <Skeleton className="h-9 flex-1 rounded-md" />

          <Skeleton className="size-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
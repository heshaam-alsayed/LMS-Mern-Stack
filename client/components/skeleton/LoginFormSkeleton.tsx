import { Skeleton } from "../ui/skeleton";

export default function LoginFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-11 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-11 w-full" />
      </div>

      <div className="flex justify-end">
        <Skeleton className="h-4 w-28" />
      </div>

      <Skeleton className="h-11 w-full" />

      <div className="flex items-center gap-3">
        <Skeleton className="h-px flex-1" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-px flex-1" />
      </div>

      <div className="grid gap-2">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>

      <div className="flex justify-center gap-1">
        <Skeleton className="h-4 w-44" />
      </div>
    </div>
  );
}
"use client";

import { Ref } from "react";

import { Skeleton } from "@/components/ui/skeleton";

function CourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-video w-full rounded-none" />

      <div className="p-5">
        <div className="space-y-2">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-3/5" />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-4 w-8" />
        </div>

        <div className="mt-4 flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

type Props = {
  ref?: Ref<HTMLDivElement>;
};

export default function CoursesSectionSkeleton({ ref }: Props) {
  return (
    <section className="py-16 sm:py-20">
      <div
        ref={ref}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
          <Skeleton className="mx-auto h-4 w-28" />

          <Skeleton className="mx-auto h-10 w-64 sm:w-80" />

          <div className="mx-auto max-w-xl space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[500px]:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
      </div>
    </section>
  );
}

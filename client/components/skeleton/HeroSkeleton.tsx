"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* ================= LEFT ================= */}
          <div className="text-center lg:pt-8 lg:text-left">
            {/* Badge */}
            <div className="mb-6 flex justify-center lg:justify-start">
              <Skeleton className="h-9 w-64 rounded-full" />
            </div>

            {/* Title */}
            <div className="space-y-3">
              <Skeleton className="mx-auto h-12 w-full max-w-xl lg:mx-0" />
              <Skeleton className="mx-auto h-12 w-4/5 max-w-lg lg:mx-0" />
            </div>

            {/* Description */}
            <div className="mx-auto mt-6 max-w-2xl space-y-2 lg:mx-0">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-11/12" />
              <Skeleton className="h-5 w-4/5" />
            </div>

            {/* Search */}
            <div className="mx-auto mt-8 max-w-2xl lg:mx-0 lg:max-w-xl">
              <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row">
                <Skeleton className="h-11 flex-1 rounded-md" />
                <Skeleton className="h-11 w-full rounded-md sm:w-24" />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Skeleton className="h-11 w-full rounded-md sm:w-40" />
              <Skeleton className="h-11 w-full rounded-md sm:w-36" />
            </div>
          </div>

          {/* ================= RIGHT - IMAGE ================= */}
          <div className="relative flex items-start justify-center">
            <Skeleton
              className="
                relative
                aspect-[9/7]
                w-full
                max-w-[560px]
                rounded-2xl
              "
            />
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
                <div className="order-2 space-y-2 text-center sm:order-1 sm:text-left">
                  <Skeleton className="mx-auto h-7 w-16 sm:mx-0" />
                  <Skeleton className="mx-auto h-4 w-20 sm:mx-0" />
                </div>

                <Skeleton className="order-1 size-5 rounded-full sm:order-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
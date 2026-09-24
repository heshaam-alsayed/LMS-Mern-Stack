"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetailSkeleton() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative border-b border-border bg-muted/40">
        <div className="mx-auto w-full max-w-[1230px] px-4 py-6 sm:px-6 sm:py-4">
          <div
            className="
              grid
              grid-cols-1
              items-start
              gap-8
              lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]
              lg:gap-[25px]
              lg:pb-[100px]
            ">
            {/* Hero Content */}
            <div className="min-w-0 pt-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Title */}
              <div className="mt-6 space-y-2">
                <Skeleton className="h-10 w-[90%] sm:h-12 lg:h-[48px]" />
                <Skeleton className="h-10 w-[70%] sm:h-12 lg:h-[48px]" />
              </div>

              {/* Description */}
              <div className="mt-5 space-y-2">
                <Skeleton className="h-5 w-[90%]" />
                <Skeleton className="h-5 w-[80%]" />
                <Skeleton className="h-5 w-[65%]" />
              </div>

              {/* Instructor */}
              <div className="mt-5 flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Course Meta */}
              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  gap-x-6
                  gap-y-3
                ">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>

                <div className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>

                <div className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Mobile Stats */}
              <div className="mt-8 block lg:hidden">
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>

              {/* Mobile Purchase Card */}
              <div className="mt-8 block lg:hidden">
                <CoursePurchaseSkeleton />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Stats */}
        <div
          className="
            absolute
            bottom-0
            left-1/2
            z-20
            hidden
            w-full
            max-w-[1230px]
            -translate-x-1/2
            translate-y-1/2
            px-4
            sm:px-6
            lg:block
            lg:px-8
          ">
          <div className="w-full lg:w-[65%]">
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
      </section>

      {/* Desktop Purchase Card */}
      <div
        className="
          pointer-events-none
          fixed
          inset-x-0
          top-16
          z-40
          hidden
          lg:block
        ">
        <div
          className="
            mx-auto
            w-full
            max-w-[1230px]
            px-4
            sm:px-6
            lg:px-8
          ">
          <div
            className="
              ml-auto
              w-[calc((100%-25px)*0.35)]
            ">
            <CoursePurchaseSkeleton />
          </div>
        </div>
      </div>

      {/* Course Content */}
      <section
        className="
          mx-auto
          max-w-[1230px]
          px-4
          py-10
          sm:px-6
          lg:px-8
          lg:py-14
        ">
        <div className="mt-8 w-full space-y-6 lg:w-[65%]">
          {/* Benefits */}
          <CourseSectionSkeleton
            titleWidth="w-40"
            rows={4}
          />

          {/* Prerequisites */}
          <CourseSectionSkeleton
            titleWidth="w-48"
            rows={3}
          />

          {/* Course Content */}
          <CourseContentListSkeleton />

          {/* Course Details */}
          <section className="mt-12">
            <Skeleton className="h-8 w-40" />

            <div className="mt-5 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[95%]" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-[70%]" />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function CoursePurchaseSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-lg">
      {/* Video */}
      <Skeleton className="aspect-video w-full rounded-none" />

      <div className="space-y-5 p-5">
        {/* Price */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Button */}
        <Skeleton className="h-11 w-full rounded-lg" />

        {/* Guarantee */}
        <div className="space-y-2">
          <Skeleton className="mx-auto h-4 w-48" />
          <Skeleton className="mx-auto h-4 w-36" />
        </div>
      </div>
    </div>
  );
}

type CourseSectionSkeletonProps = {
  titleWidth: string;
  rows: number;
};

function CourseSectionSkeleton({
  titleWidth,
  rows,
}: CourseSectionSkeletonProps) {
  return (
    <div className="space-y-5">
      <Skeleton className={`h-8 ${titleWidth}`} />

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-start gap-3">
            <Skeleton className="mt-1 size-5 shrink-0 rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[70%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseContentListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />

      <div className="overflow-hidden rounded-xl border">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="
              flex
              items-center
              gap-4
              border-b
              px-4
              py-4
              last:border-b-0
            ">
            <Skeleton className="size-8 shrink-0 rounded-full" />

            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-[75%]" />
              <Skeleton className="h-3 w-[45%]" />
            </div>

            <Skeleton className="h-4 w-12 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
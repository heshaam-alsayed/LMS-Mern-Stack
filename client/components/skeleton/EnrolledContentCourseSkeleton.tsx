import React from "react";

export default function EnrolledContentCourseSkeleton() {
  return (
    <div className="w-full px-2 flex flex-col gap-2 md:flex-row">
      {/* Left Side */}
      <div className="md:w-[65%]">
        <div className="w-full p-3">
          {/* Video Skeleton */}
          <div className="aspect-video w-full animate-pulse rounded-lg bg-muted" />

          {/* Lesson Navigation */}
          <div className="mt-4 flex items-center justify-between">
            <div className="h-9 w-36 animate-pulse rounded-md bg-muted" />
            <div className="h-9 w-36 animate-pulse rounded-md bg-muted" />
          </div>

          {/* Current Lesson */}
          <div className="my-3 px-5 py-4">
            <div className="mb-2 h-3 w-28 animate-pulse rounded bg-muted" />

            <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
          </div>

          {/* Tabs */}
          <div className="w-full">
            <div className="flex w-full rounded-sm bg-muted p-1">
              <div className="h-10 flex-1 animate-pulse rounded bg-background/50" />
              <div className="h-10 flex-1 animate-pulse rounded bg-background/50" />
              <div className="h-10 flex-1 animate-pulse rounded bg-background/50" />
              <div className="h-10 flex-1 animate-pulse rounded bg-background/50" />
            </div>

            {/* Tab Content */}
            <div className="mt-5 space-y-3">
              <div className="h-5 w-40 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="md:w-[35%]">
        <div className="space-y-3">
          {/* Section 1 */}
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="size-4 animate-pulse rounded bg-muted" />

                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
              </div>

              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>

            <div className="border-t border-border">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="size-4 animate-pulse rounded-full bg-muted" />
                <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
                <div className="h-4 w-10 animate-pulse rounded bg-muted" />
              </div>

              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="size-4 animate-pulse rounded-full bg-muted" />
                <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
                <div className="h-4 w-10 animate-pulse rounded bg-muted" />
              </div>

              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="size-4 animate-pulse rounded-full bg-muted" />
                <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
                <div className="h-4 w-10 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="size-4 animate-pulse rounded bg-muted" />

                <div className="h-5 w-40 animate-pulse rounded bg-muted" />
              </div>

              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>

          {/* Section 3 */}
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="size-4 animate-pulse rounded bg-muted" />

                <div className="h-5 w-28 animate-pulse rounded bg-muted" />
              </div>

              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>

          {/* Section 4 */}
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="size-4 animate-pulse rounded bg-muted" />

                <div className="h-5 w-36 animate-pulse rounded bg-muted" />
              </div>

              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
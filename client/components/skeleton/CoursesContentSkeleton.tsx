"use client";

export default function CoursesContentSkeleton() {
  return (
    <main className="min-h-screen px-2 sm:px-4">
      <section className="py-4">
        <div className="animate-pulse">
          {/* Courses Grid */}
          <div
            className="
              grid
              grid-cols-1
              gap-x-3
              gap-y-6
              min-[500px]:grid-cols-2
              md:grid-cols-3
              2xl:grid-cols-4
            ">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-border bg-card">
                {/* Course Image */}
                <div className="aspect-video w-full bg-muted" />

                {/* Course Content */}
                <div className="space-y-4 p-4">
                  {/* Category */}
                  <div className="h-3 w-20 rounded bg-muted" />

                  {/* Title */}
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-3/4 rounded bg-muted" />
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-muted" />
                    <div className="h-3 w-24 rounded bg-muted" />
                  </div>

                  {/* Rating / Students */}
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-20 rounded bg-muted" />
                    <div className="h-3 w-16 rounded bg-muted" />
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-16 rounded bg-muted" />
                    <div className="h-3 w-12 rounded bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-15 flex justify-center">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-full bg-muted" />
              <div className="size-9 rounded-full bg-muted" />
              <div className="size-9 rounded-full bg-muted" />
              <div className="size-9 rounded-full bg-muted" />
              <div className="size-9 rounded-full bg-muted" />
            </div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="mt-10 h-20 w-full rounded-lg bg-muted/50 animate-pulse" />
      </section>
    </main>
  );
}
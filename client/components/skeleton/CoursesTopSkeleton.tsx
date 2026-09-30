"use client";

export default function CoursesTopSkeleton() {
  return (
    <section>
      <div className="container mx-auto px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 animate-pulse">
          {/* Categories */}
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              {/* Previous */}
              <div className="size-9 shrink-0 rounded-full bg-muted" />

              {/* Category Pills */}
              <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                <div className="h-9 w-28 shrink-0 rounded-full bg-muted" />
                <div className="h-9 w-24 shrink-0 rounded-full bg-muted" />
                <div className="h-9 w-28 shrink-0 rounded-full bg-muted" />
                <div className="h-9 w-24 shrink-0 rounded-full bg-muted" />
                <div className="h-9 w-28 shrink-0 rounded-full bg-muted" />
              </div>

              {/* Next */}
              <div className="size-9 shrink-0 rounded-full bg-muted" />
            </div>
          </div>

          {/* Reset */}
          <div className="h-9 w-20 shrink-0 rounded-full bg-muted" />

          {/* All Filters */}
          <div className="h-9 w-28 shrink-0 rounded-full bg-muted" />
        </div>
      </div>
    </section>
  );
}
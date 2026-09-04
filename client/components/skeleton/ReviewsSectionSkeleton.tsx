"use client";

export default function ReviewsSectionSkeleton() {
  return (
    <section className="container mx-auto px-4 py-20">
      {/* Section Intro */}
      <div className="mx-auto max-w-3xl text-center">
        {/* Badge */}
        <div className="mx-auto h-7 w-32 animate-pulse rounded-full bg-muted" />

        {/* Heading */}
        <div className="mt-5 flex animate-pulse flex-col items-center gap-2">
          <div className="h-10 w-3/4 rounded-md bg-muted sm:h-11 lg:h-14" />
          <div className="h-10 w-1/2 rounded-md bg-muted sm:h-11 lg:h-14" />
        </div>

        {/* Description */}
        <div className="mx-auto mt-5 max-w-2xl space-y-2 animate-pulse">
          <div className="mx-auto h-4 w-full rounded bg-muted" />
          <div className="mx-auto h-4 w-11/12 rounded bg-muted" />
          <div className="mx-auto h-4 w-4/5 rounded bg-muted" />
        </div>

        {/* Second Description */}
        <div className="mx-auto mt-4 max-w-2xl space-y-2 animate-pulse">
          <div className="mx-auto h-4 w-11/12 rounded bg-muted" />
          <div className="mx-auto h-4 w-3/4 rounded bg-muted" />
        </div>
      </div>

      {/* Reviews Cards */}
      <div className="mt-16">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <ReviewCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCardSkeleton() {
  return (
    <article className="animate-pulse rounded-2xl border border-primary/10 bg-primary/[0.03] p-3 shadow-sm dark:bg-primary/[0.06]">
      {/* Top Section */}
      <div className="flex items-start justify-between gap-4">
        {/* User */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Avatar */}
          <div className="size-12 shrink-0 rounded-full bg-muted" />

          {/* User Info */}
          <div className="min-w-0 space-y-2">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-3 w-24 rounded bg-muted" />
          </div>
        </div>

        {/* Rating */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="size-4 rounded-sm bg-muted" />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-primary/10" />

      {/* Comment */}
      <div className="space-y-2 pl-4">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-11/12 rounded bg-muted" />
        <div className="h-4 w-4/5 rounded bg-muted" />
      </div>
    </article>
  );
}
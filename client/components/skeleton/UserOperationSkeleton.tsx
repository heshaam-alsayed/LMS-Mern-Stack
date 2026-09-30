import { Skeleton } from "@/components/ui/skeleton";

export default function UserOperationSkeleton() {
  return (
    <div className="space-y-8">
      {/* =========================
          User Information
      ========================== */}
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />

          <div className="space-y-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
        </div>

        {/* User Card */}
        <section className="overflow-hidden rounded-2xl border border-border/60 bg-card">
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* User */}
              <div className="flex min-w-0 items-center gap-4">
                <Skeleton className="h-20 w-20 shrink-0 rounded-2xl sm:h-24 sm:w-24" />

                <div className="min-w-0 space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-44 sm:h-7 sm:w-52" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>

                  <Skeleton className="h-4 w-56 max-w-full" />

                  <div className="flex gap-2">
                    <Skeleton className="h-7 w-20 rounded-lg" />
                    <Skeleton className="h-7 w-20 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="mt-2 h-6 w-8" />
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="mt-2 h-5 w-24" />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="mt-6 grid gap-3 border-t border-border/60 pt-5 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-muted/30 px-4 py-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />

                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-muted/30 px-4 py-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />

                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* =========================
          User Statistics
      ========================== */}
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />

          <div className="space-y-1.5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5"
            >
              <div className="flex items-start justify-between">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <Skeleton className="h-7 w-7 rounded-full" />
              </div>

              <div className="mt-5 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================
          Purchased Courses
      ========================== */}
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />

          <div className="space-y-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
        </div>

        {/* Course Cards */}
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-2xl border border-border/60 bg-card"
            >
              <div className="p-4 sm:p-5">
                {/* Course Top */}
                <div className="flex flex-col gap-5 lg:flex-row">
                  {/* Thumbnail */}
                  <Skeleton className="aspect-video w-full shrink-0 rounded-xl sm:w-64 lg:w-72" />

                  {/* Course Information */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex gap-2">
                      <Skeleton className="h-7 w-24 rounded-lg" />
                      <Skeleton className="h-7 w-24 rounded-lg" />
                    </div>

                    <div className="mt-3 space-y-2">
                      <Skeleton className="h-6 w-full max-w-xl" />
                      <Skeleton className="h-6 w-4/5 max-w-lg" />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-36" />
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <div className="space-y-1.5">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-6 w-16" />
                      </div>

                      <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="mt-1.5 h-4 w-16" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-5 border-t border-border/60 pt-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>

                    <div className="flex w-full items-center gap-3 sm:w-[320px] lg:w-[420px]">
                      <Skeleton className="h-2.5 flex-1 rounded-full" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  </div>

                  {/* Current Lecture + Last Access */}
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />

                        <div className="min-w-0 flex-1 space-y-1.5">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-4 w-full max-w-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />

                        <div className="space-y-1.5">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =========================
          Purchase History
      ========================== */}
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />

          <div className="space-y-1.5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
        </div>

        {/* Purchase History */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
          {/* Desktop Header */}
          <div className="hidden border-b border-border/60 bg-muted/30 px-5 py-3 lg:grid lg:grid-cols-[1.8fr_1fr_1fr_1.2fr_1.2fr] lg:items-center lg:gap-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>

          <div className="divide-y divide-border/60">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="p-4 sm:p-5">
                {/* Desktop */}
                <div className="hidden lg:grid lg:grid-cols-[1.8fr_1fr_1fr_1.2fr_1.2fr] lg:items-center lg:gap-4">
                  {/* Course */}
                  <div className="flex min-w-0 items-center gap-3">
                    <Skeleton className="h-14 w-20 shrink-0 rounded-lg" />

                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-full max-w-xs" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-8" />
                  </div>

                  {/* Status */}
                  <Skeleton className="h-7 w-20 rounded-lg" />

                  {/* Payment */}
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-28" />
                  </div>

                  {/* Date */}
                  <Skeleton className="h-4 w-24" />
                </div>

                {/* Mobile / Tablet */}
                <div className="lg:hidden">
                  <div className="flex gap-4">
                    <Skeleton className="h-20 w-28 shrink-0 rounded-xl sm:h-24 sm:w-36" />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1 space-y-2">
                          <Skeleton className="h-4 w-full max-w-sm" />
                          <Skeleton className="h-4 w-4/5 max-w-xs" />
                        </div>

                        <Skeleton className="h-7 w-16 shrink-0 rounded-lg" />
                      </div>

                      <Skeleton className="mt-2 h-3 w-24" />

                      <Skeleton className="mt-2 h-6 w-16" />
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="mt-4 grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-muted/30 p-3">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="mt-2 h-4 w-24" />
                    </div>

                    <div className="rounded-xl bg-muted/30 p-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="mt-2 h-4 w-full max-w-xs" />
                    </div>
                  </div>

                  {/* Order ID */}
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5">
                    <Skeleton className="h-4 w-48 max-w-[70%]" />
                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
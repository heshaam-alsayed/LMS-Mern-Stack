export function OrganizationCertificatesGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
          <div className="h-32 w-full animate-pulse bg-muted" />

          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-muted" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
              <div className="h-14 animate-pulse rounded-lg bg-muted/60" />
              <div className="h-14 animate-pulse rounded-lg bg-muted/60" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrganizationCertificatesPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-background p-6">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-muted" />

          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-6 w-56 animate-pulse rounded bg-muted" />
            <div className="h-3 w-72 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-background px-4 py-3">
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            <div className="mt-2.5 h-7 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="h-10 w-full animate-pulse rounded-md bg-muted sm:w-[340px]" />
        <div className="h-10 w-full animate-pulse rounded-md bg-muted sm:w-28" />
      </div>

      <OrganizationCertificatesGridSkeleton />
    </div>
  );
}

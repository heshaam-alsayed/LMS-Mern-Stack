"use client";

export default function InvoicesSkeleton() {
  return (
    <div className="w-full">
      {/* Table Skeleton */}
      <div className="w-full overflow-hidden rounded-xl border border-border bg-card">
        {/* Header */}
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />

            <div className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />

              <div className="h-3 w-48 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left">
                  <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                </th>

                <th className="px-5 py-3 text-left">
                  <div className="h-3 w-14 animate-pulse rounded bg-muted" />
                </th>

                <th className="px-5 py-3 text-left">
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                </th>

                <th className="px-5 py-3 text-left">
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                </th>

                <th className="px-5 py-3 text-right">
                  <div className="ml-auto h-3 w-12 animate-pulse rounded bg-muted" />
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {Array.from({ length: 8 }).map((_, index) => (
                <tr key={index}>
                  {/* User */}
                  <td className="px-5 py-4">
                    <div className="space-y-2">
                      <div className="h-4 w-32 animate-pulse rounded bg-muted" />

                      <div className="h-2.5 w-24 animate-pulse rounded bg-muted" />
                    </div>
                  </td>

                  {/* Course */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 shrink-0 animate-pulse rounded-md bg-muted" />

                      <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4">
                    <div className="space-y-2">
                      <div className="h-4 w-16 animate-pulse rounded bg-muted" />

                      <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
                    </div>
                  </td>

                  {/* Created */}
                  <td className="px-5 py-4">
                    <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

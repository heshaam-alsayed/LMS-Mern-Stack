import { Skeleton } from "@/components/ui/skeleton";

export function CertificatePageSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="min-h-screen animate-pulse bg-background px-4 py-6 text-foreground sm:px-6 lg:px-10 lg:py-8">
      <span className="sr-only">Loading your certificate</span>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-7">
        <header className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="p-5 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <Skeleton className="size-12 shrink-0 rounded-xl sm:size-14" />

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Skeleton className="h-3 w-40" />

                    <Skeleton className="size-1 rounded-full" />

                    <Skeleton className="h-6 w-32 rounded-full" />
                  </div>

                  <Skeleton className="h-7 w-[min(100%,26rem)] sm:h-8" />

                  <Skeleton className="mt-3 h-3.5 w-[min(100%,34rem)]" />

                  <Skeleton className="mt-2 h-3.5 w-[min(100%,24rem)]" />
                </div>
              </div>

              <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row lg:w-auto">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-11 w-full sm:w-40" />

                  <Skeleton className="h-11 w-full sm:w-40" />
                </div>

                <Skeleton className="h-11 w-full sm:w-48" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2 xl:grid-cols-4">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="flex min-w-0 items-center gap-3">
                  <Skeleton className="size-9 shrink-0 rounded-lg" />

                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-3 w-20" />

                    <Skeleton className="mt-2 h-3.5 w-28" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="min-w-0">
          <div className="rounded-[3px] bg-[#f7f4ed] p-3 shadow-[0_24px_70px_rgba(33,38,38,0.16)] sm:p-5">
            <div className="flex min-h-[610px] flex-col justify-between overflow-hidden border-[10px] border-[#d2ad63]/30 bg-[#f8f7f1] px-4 py-9 sm:min-h-[660px] sm:px-16 sm:py-12">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-16 place-items-center rounded-full bg-[#18252b]/10">
                    <Skeleton className="size-8 rounded-full" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28 bg-[#8b6b3f]/20" />

                    <Skeleton className="h-2.5 w-24 bg-[#8b6b3f]/15" />
                  </div>
                </div>

                <div className="ml-auto min-w-0 space-y-2 text-right">
                  <Skeleton className="ml-auto h-2.5 w-20 bg-[#8b6b3f]/15" />

                  <Skeleton className="ml-auto h-2.5 w-32 bg-[#8b6b3f]/15" />
                </div>
              </div>

              <div className="mx-auto max-w-2xl text-center">
                <div className="mb-6 flex items-center justify-center gap-4">
                  <Skeleton className="h-px w-16 bg-[#d2ad63]/25" />

                  <Skeleton className="size-4 rounded-full bg-[#d2ad63]/25" />

                  <Skeleton className="h-px w-16 bg-[#d2ad63]/25" />
                </div>

                <Skeleton className="mx-auto h-3 w-56 bg-[#8b6b3f]/15" />

                <Skeleton className="mx-auto mt-6 h-10 w-[min(100%,22rem)] sm:h-14" />

                <Skeleton className="mx-auto mt-6 h-3.5 w-[min(100%,32rem)]" />

                <Skeleton className="mx-auto mt-2 h-3.5 w-[min(100%,26rem)]" />

                <Skeleton className="my-8 h-px bg-[#d2ad63]/25" />

                <Skeleton className="mx-auto h-7 w-[min(100%,20rem)] sm:h-8" />

                <Skeleton className="mx-auto mt-4 h-2.5 w-64 bg-[#8b6b3f]/15" />
              </div>

              <div className="grid grid-cols-3 items-end gap-3 text-center sm:gap-5">
                <div>
                  <Skeleton className="mx-auto h-16 w-28 sm:h-24 sm:w-64" />

                  <Skeleton className="mx-auto mt-2 h-px w-24 sm:w-36" />

                  <Skeleton className="mx-auto mt-2 h-2.5 w-28 bg-[#8b6b3f]/15" />
                </div>

                <div className="mx-auto grid size-14 place-items-center rounded-full border-2 border-[#d2ad63]/40 bg-[#f8f1df] sm:size-24">
                  <Skeleton className="size-8 rounded-full sm:size-10" />
                </div>

                <div>
                  <Skeleton className="mx-auto h-px w-20 sm:w-28" />

                  <Skeleton className="mx-auto mt-2 h-2.5 w-24" />

                  <Skeleton className="mx-auto mt-2 h-2.5 w-20 bg-[#8b6b3f]/15" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default CertificatePageSkeleton;
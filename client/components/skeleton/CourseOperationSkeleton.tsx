"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function CourseOperationSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
        <CardContent className="p-0">
          <div className="grid items-stretch md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
            <Skeleton className="min-h-[220px] rounded-none md:min-h-full" />

            <div className="flex min-w-0 flex-col p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>

              <Skeleton className="mt-4 h-7 w-[75%] max-w-[500px]" />

              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      <Skeleton className="h-3.5 w-3.5 rounded-full" />
                      <Skeleton className="h-3 w-16" />
                    </div>

                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Skeleton className="h-7 w-7 rounded-md" />

                    <div className="space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section>
        <div className="mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="border-border/60 bg-card shadow-sm"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>

                  <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-7 rounded-full" />
          </div>

          <Skeleton className="mt-2 h-4 w-56" />
        </div>

        <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
          <CardContent className="p-0">
            <div className="hidden grid-cols-[minmax(220px,1.5fr)_minmax(200px,1.3fr)_100px_110px_140px] items-center gap-4 border-b border-border/60 bg-muted/20 px-5 py-3 md:grid">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-3 w-16" />
              ))}
            </div>

            <div className="divide-y divide-border/60">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="px-5 py-4">
                  <div className="hidden grid-cols-[minmax(220px,1.5fr)_minmax(200px,1.3fr)_100px_110px_140px] items-center gap-4 md:grid">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>

                    <Skeleton className="h-4 w-32" />

                    <Skeleton className="h-4 w-14" />

                    <Skeleton className="h-6 w-16 rounded-full" />

                    <Skeleton className="h-4 w-24" />
                  </div>

                  <div className="space-y-4 md:hidden">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-36" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 border-t border-border/60 pt-3">
                      {Array.from({ length: 3 }).map((_, itemIndex) => (
                        <div key={itemIndex} className="space-y-1.5">
                          <Skeleton className="h-3 w-12" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function CourseAnalyticsSectionSkeleton() {
  return (
    <section>
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />

          <Skeleton className="h-6 w-36" />
        </div>

        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <Card className="border-border/60 bg-card shadow-sm">
        <CardContent className="p-5">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-[70px] rounded-lg" />

              <Skeleton className="h-[70px] rounded-lg" />
            </div>

            <Skeleton className="h-[280px] w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

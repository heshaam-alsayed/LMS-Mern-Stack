"use client";

import { AlertCircle, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import useCourseOrdersAnalytics from "@/customHooks/useCourseOrdersAnalytics";

import CourseOrdersAnalyticsChart from "./CourseOrdersAnalyticsChart";

function AnalyticsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-[70px] rounded-lg" />
        <Skeleton className="h-[70px] rounded-lg" />
      </div>

      <Skeleton className="h-[280px] w-full rounded-lg" />
    </div>
  );
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string | null;
  courseName: string;
};

export default function CourseAnalyticsModal({
  open,
  onOpenChange,
  courseId,
  courseName,
}: Props) {
  const { monthly, totalOrders, totalRevenue, isLoading, isError, error, refetch } =
    useCourseOrdersAnalytics(courseId, open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Course analytics
          </DialogTitle>

          <DialogDescription>
            Orders and revenue for {courseName} over the last 12 months.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {isLoading ? (
            <AnalyticsSkeleton />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Could not load analytics
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                  {error?.message ??
                    "We could not load this course analytics right now."}
                </p>
              </div>

              <Button variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : (
            <CourseOrdersAnalyticsChart
              monthly={monthly}
              courseName={courseName}
              totalOrders={totalOrders}
              totalRevenue={totalRevenue}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

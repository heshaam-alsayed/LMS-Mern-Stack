"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, CalendarRange } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import useCourseOrdersAnalytics from "@/customHooks/useCourseOrdersAnalytics";
import { useSectionInView } from "@/hooks/useSectionInView";

import CourseAnalyticsSectionSkeleton from "@/components/skeleton/CourseAnalyticsSectionSkeleton";

const CourseOrdersAnalyticsChart = dynamic(
  () => import("@/components/instructor/dashboard/CourseOrdersAnalyticsChart"),
  {
    ssr: false,
    loading: () => <CourseAnalyticsSectionSkeleton />,
  },
);

type Props = {
  courseId: string;
  courseName: string;
};

export default function CourseAnalyticsSection({
  courseId,
  courseName,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, hasEnteredView } = useSectionInView<HTMLElement>("300px 0px");

  const {
    monthly,
    totalOrders,
    totalRevenue,
    isLoading,
    isError,
    error,
    refetch,
  } = useCourseOrdersAnalytics(courseId, isOpen || hasEnteredView);

  return (
    <section ref={ref}>
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
          <CalendarRange className="h-5 w-5 text-primary" />

          Sales analytics
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Orders and revenue for {courseName} over the last 12 months.
        </p>
      </div>

      <Card className="border-border/60 bg-card shadow-sm">
        <CardContent className="p-5">
          {!isOpen && !hasEnteredView ? (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 py-14 text-center transition-colors hover:bg-muted/30">
              <span className="text-sm font-medium text-foreground">
                Load sales analytics
              </span>

              <span className="text-xs text-muted-foreground">
                Fetch orders and revenue for this course.
              </span>
            </button>
          ) : isLoading ? (
            <CourseAnalyticsSectionSkeleton />
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
        </CardContent>
      </Card>
    </section>
  );
}

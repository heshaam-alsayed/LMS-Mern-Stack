"use client";

import { useQuery } from "@tanstack/react-query";

import { getOperationCourse } from "@/lib/api/getOperationCourse";
import { useSectionInView } from "@/hooks/useSectionInView";

import CourseOverview from "./CourseOverview";
import CoursePerformance from "./CoursePerformance";
import RecentOrders from "./RecentOrders";
import CourseAnalyticsSection from "./CourseAnalyticsSection";
import CourseOperationError from "./CourseOperationError";

import CourseOperationSkeleton from "@/components/skeleton/CourseOperationSkeleton";

type Props = {
  courseId: string;
};

export default function CourseOperation({ courseId }: Props) {
  const { ref, hasEnteredView } = useSectionInView<HTMLDivElement>("200px 0px");

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["get-operation-course", courseId],
    queryFn: () => getOperationCourse(courseId),
    enabled: hasEnteredView,
    staleTime: 60 * 1000,
  });

  if (!hasEnteredView || isLoading) {
    return (
      <div ref={ref}>
        <CourseOperationSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <CourseOperationError onRetry={() => refetch()} isRetrying={isFetching} />
    );
  }

  const course = data?.data?.course;
  const orders = data?.data?.orders;
  const statistics = data?.data?.statistics;

  if (!course || !statistics) {
    return (
      <CourseOperationError onRetry={() => refetch()} isRetrying={isFetching} />
    );
  }

  return (
    <div className="space-y-6">
      <CourseOverview course={course} />

      <CoursePerformance
        course={course}
        orders={orders}
        statistics={statistics}
      />

      <CourseAnalyticsSection courseId={courseId} courseName={course.name} />

      <RecentOrders orders={orders} />
    </div>
  );
}

"use client";

import { getOperationCourse } from "@/lib/api/getOperationCourse";
import { useQuery } from "@tanstack/react-query";
import React from "react";

import CourseOverview from "./CourseOverview";
import CoursePerformance from "./CoursePerformance";
import RecentOrders from "./RecentOrders";
import CourseOperationError from "./CourseOperationError";
import CourseOperationSkeleton from "@/components/skeleton/CourseOperationSkeleton";

type Props = {
  courseId: string;
};

export default function CourseOperation({ courseId }: Props) {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["get-operation-course", courseId],
    queryFn: () => getOperationCourse(courseId),
  });

  if (isLoading) {
    return <CourseOperationSkeleton />;
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

      <RecentOrders orders={orders} />
    </div>
  );
}

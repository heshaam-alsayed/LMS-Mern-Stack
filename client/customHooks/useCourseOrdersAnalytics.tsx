"use client";

import { useQuery } from "@tanstack/react-query";

import { getCourseOrdersAnalytics } from "@/lib/api/getCourseOrdersAnalytics";

export default function useCourseOrdersAnalytics(
  courseId: string | null,
  enabled = true,
) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["course-orders-analytics", courseId],
    queryFn: () => getCourseOrdersAnalytics(courseId as string),
    // only fetch once the modal is open and a course
    enabled: enabled && Boolean(courseId),
    staleTime: 5 * 60 * 1000,
  });

  return {
    course: data?.course ?? null,
    monthly: data?.monthly ?? [],
    totalOrders: data?.totalOrders ?? 0,
    totalRevenue: data?.totalRevenue ?? 0,
    isLoading,
    isError,
    error,
    refetch,
  };
}

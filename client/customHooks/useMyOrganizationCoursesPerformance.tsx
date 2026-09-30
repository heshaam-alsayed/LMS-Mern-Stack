"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyOrganizationCoursesPerformance } from "@/lib/api/getMyOrganizationCoursesStatistics";

import { MyOrganizationCoursesPerformanceParams } from "@/types/organization.type";

export default function useMyOrganizationCoursesPerformance(
  params: MyOrganizationCoursesPerformanceParams = {},
) {
  const { page, limit } = params;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["my-organization-courses-performance", { page, limit }],
    queryFn: () => getMyOrganizationCoursesPerformance({ page, limit }),
    staleTime: 5 * 60 * 1000,
  });

  return {
    statistics: data?.statistics ?? [],
    pagination: data?.pagination,
    isLoading,
    isError,
    error,
    refetch,
  };
}

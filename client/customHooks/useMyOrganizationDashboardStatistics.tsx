"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyOrganizationDashboardStatistics } from "@/lib/api/getMyOrganizationDashboardStatistics";

export default function useMyOrganizationDashboardStatistics() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["my-organization-dashboard-statistics"],
    queryFn: () => getMyOrganizationDashboardStatistics(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    organization: data?.organization ?? null,
    statistics: data?.statistics ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
}

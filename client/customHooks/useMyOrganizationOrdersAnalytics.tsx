"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyOrganizationOrdersAnalytics } from "@/lib/api/getMyOrganizationOrdersAnalytics";

type Props = {
  year: string;
};

export default function useMyOrganizationOrdersAnalytics({ year }: Props) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["my-organization-orders-analytics", year],
    queryFn: () => getMyOrganizationOrdersAnalytics(year),
    staleTime: 5 * 60 * 1000,
  });

  return {
    statistics: data?.data.statistics ?? null,
    monthly: data?.data.monthly ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}

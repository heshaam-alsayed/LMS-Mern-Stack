"use client";

import { useQuery } from "@tanstack/react-query";

import { getOrganizationOrdersAnalytics } from "@/lib/api/getOrganizationOrdersAnalytics";

type Props = {
  id: string;
  year: string;
};

export default function useOrganizationOrdersAnalytics({ id, year }: Props) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["organization-orders-analytics", id, year],
    queryFn: () => getOrganizationOrdersAnalytics(id, year),
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

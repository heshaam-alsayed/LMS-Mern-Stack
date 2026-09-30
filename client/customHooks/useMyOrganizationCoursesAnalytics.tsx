"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyOrganizationCoursesAnalytics } from "@/lib/api/getMyOrganizationCoursesAnalytics";

type Props = {
  year: string;
};

export default function useMyOrganizationCoursesAnalytics({ year }: Props) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["my-organization-courses-analytics", year],
    queryFn: () => getMyOrganizationCoursesAnalytics(year),
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

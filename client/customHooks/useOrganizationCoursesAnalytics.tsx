"use client";

import { useQuery } from "@tanstack/react-query";

import { getOrganizationCoursesAnalytics } from "@/lib/api/getOrganizationCoursesAnalytics";

type Props = {
  id: string;
  year: string;
};

export default function useOrganizationCoursesAnalytics({
  id,
  year,
}: Props) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["organization-courses-analytics", id, year],
    queryFn: () => getOrganizationCoursesAnalytics(id, year),
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

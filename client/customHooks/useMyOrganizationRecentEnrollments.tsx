"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyOrganizationRecentEnrollments } from "@/lib/api/getMyOrganizationRecentEnrollments";

export default function useMyOrganizationRecentEnrollments(top = 5) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["my-organization-recent-enrollments", top],
    queryFn: () => getMyOrganizationRecentEnrollments(top),
    staleTime: 60 * 1000,
  });

  return {
    enrollments: data?.enrollments ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}

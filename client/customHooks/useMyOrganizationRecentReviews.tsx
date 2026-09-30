"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyOrganizationRecentReviews } from "@/lib/api/getMyOrganizationRecentReviews";

export default function useMyOrganizationRecentReviews(top = 5) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["my-organization-recent-reviews", top],
    queryFn: () => getMyOrganizationRecentReviews(top),
    staleTime: 60 * 1000,
  });

  return {
    reviews: data?.reviews ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}

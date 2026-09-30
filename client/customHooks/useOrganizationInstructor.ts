"use client";

import { useQuery } from "@tanstack/react-query";

import { getOrganizationInstructor } from "@/lib/api/getOrganizationInstructor";

type Props = {
  id: string;
  enabled: boolean;
};

export default function useOrganizationInstructor({ id, enabled }: Props) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["organization-instructor", id],
    queryFn: () => getOrganizationInstructor(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    instructor: data?.data.instructor ?? null,
    coursesCount: data?.data.coursesCount ?? 0,
    isLoading,
    isError,
    error,
    refetch,
  };
}

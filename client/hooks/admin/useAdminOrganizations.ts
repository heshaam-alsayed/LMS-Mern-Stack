"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAllOrganizations } from "@/lib/api/getAllOrganizations";
import { PaginationData } from "@/components/shared/Pagination";

export default function useAdminOrganizations() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.toString();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-organizations", query],
    queryFn: () => getAllOrganizations(query),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  const pagination = data?.pagination as PaginationData | undefined;

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key !== "page") {
      params.delete("page");
    }

    const next = params.toString();

    router.push(next ? `${pathname}?${next}` : pathname);
  };

  const handleNext = () => {
    if (!pagination?.hasNextPage) return;

    updateQuery("page", String(pagination.currentPage + 1));
  };

  const handlePrevious = () => {
    if (!pagination?.hasPreviousPage) return;

    updateQuery("page", String(pagination.currentPage - 1));
  };

  return {
    organizations: data?.organizations ?? [],
    pagination,
    isLoading,
    isError,
    error,
    refetch,
    status: searchParams.get("status") || "all",
    limit: searchParams.get("limit") || String(pagination?.limit ?? 10),
    updateQuery,
    handleNext,
    handlePrevious,
  };
}

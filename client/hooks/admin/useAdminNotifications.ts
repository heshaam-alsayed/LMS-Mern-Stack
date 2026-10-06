"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getAllNotifications } from "@/lib/api/getAllNotifications";

export default function useAdminNotifications() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.toString();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-notifications", query],
    queryFn: () => getAllNotifications(query),
    staleTime: 5 * 60 * 1000,
  });

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

    router.push(`${pathname}?${params.toString()}`);
  };

  const pagination = data?.pagination;

  const handleNext = () => {
    if (!pagination?.hasNextPage) return;

    updateQuery("page", String(pagination.currentPage + 1));
  };

  const handlePrevious = () => {
    if (!pagination?.hasPreviousPage) return;

    updateQuery("page", String(pagination.currentPage - 1));
  };

  return {
    notifications: data?.notifications ?? [],
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

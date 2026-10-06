"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAllCourses } from "@/lib/api/getAllCourses";
import { PaginationData } from "@/components/shared/Pagination";

import { RANGE_MAX } from "../constants";

export default function useAdminCourses() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.toString();

  const { data, isFetching, error, isError } = useQuery({
    queryKey: ["all-courses", query],
    queryFn: () => getAllCourses(query),
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

  const updateRangeQuery = (field: string, min: number, max: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (min > 0) {
      params.set(`${field}[gte]`, String(min));
    } else {
      params.delete(`${field}[gte]`);
    }

    if (max < RANGE_MAX) {
      params.set(`${field}[lte]`, String(max));
    } else {
      params.delete(`${field}[lte]`);
    }

    params.delete("page");

    const next = params.toString();

    router.push(next ? `${pathname}?${next}` : pathname);
  };

  const resetFilters = () => {
    router.push(pathname);
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
    courses: data?.courses ?? [],
    pagination,
    isFetching,
    error: isError ? error : null,
    status: searchParams.get("status") || "all",
    level: searchParams.get("level") || "all",
    ratings: searchParams.get("ratings[gte]") || "all",
    purchased: searchParams.get("purchased[gte]") || "all",
    sort: searchParams.get("sort") || "all",
    limit: searchParams.get("limit") || String(pagination?.limit ?? 10),
    urlSearch: searchParams.get("search") || "",
    updateQuery,
    updateRangeQuery,
    resetFilters,
    handleNext,
    handlePrevious,
  };
}

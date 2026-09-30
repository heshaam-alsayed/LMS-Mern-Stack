"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebounce } from "@/customHooks/useDebounce";

import OrganizationCoursesSelectFilters from "./filters/OrganizationCoursesSelectFilters";
import OrganizationCoursesSearchFilter from "./filters/OrganizationCoursesSearchFilter";
import OrganizationCoursesPriceFilters from "./filters/OrganizationCoursesPriceFilters";

import Pagination, { PaginationData } from "@/components/shared/Pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LIMIT_OPTIONS = [5, 10, 15, 20];

type Props = {
  pagination: PaginationData;
};

export default function OrganizationCoursesFilter({ pagination }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [price, setPrice] = useState({
    min: searchParams.get("price[gte]") || "",
    max: searchParams.get("price[lte]") || "",
  });

  const [estimatedPrice, setEstimatedPrice] = useState({
    min: searchParams.get("estimatePrice[gte]") || "",
    max: searchParams.get("estimatePrice[lte]") || "",
  });

  const debouncedSearch = useDebounce(search, 1000);

  const debouncedPrice = useDebounce(price, 1000);

  const debouncedEstimatedPrice = useDebounce(estimatedPrice, 1000);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Reset page whenever filter/search/limit changes
    if (key !== "page") {
      params.delete("page");
    }

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const updateRangeQuery = (field: string, min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (min) {
      params.set(`${field}[gte]`, min);
    } else {
      params.delete(`${field}[gte]`);
    }

    if (max) {
      params.set(`${field}[lte]`, max);
    } else {
      params.delete(`${field}[lte]`);
    }

    params.delete("page");

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleNext = () => {
    if (!pagination.hasNextPage) return;

    updateQuery("page", String(pagination.currentPage + 1));
  };

  const handlePrevious = () => {
    if (!pagination.hasPreviousPage) return;

    updateQuery("page", String(pagination.currentPage - 1));
  };

  const handleLimitChange = (value: string) => {
    updateQuery("limit", value);
  };

  const currentLimit = searchParams.get("limit") || "10";

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <OrganizationCoursesSelectFilters
          searchParams={searchParams}
          updateQuery={updateQuery}
        />

        {/* ==================== ITEMS PER PAGE ==================== */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="org-courses-limit"
            className="text-sm font-medium text-foreground">
            Items per page
          </label>

          <Select value={currentLimit} onValueChange={handleLimitChange}>
            <SelectTrigger
              id="org-courses-limit"
              className="h-10 w-full sm:w-[160px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>

            <SelectContent className="w-[160px]">
              {LIMIT_OPTIONS.map((limit) => (
                <SelectItem key={limit} value={String(limit)}>
                  {limit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <OrganizationCoursesSearchFilter
          search={search}
          setSearch={setSearch}
          debouncedSearch={debouncedSearch}
          updateQuery={updateQuery}
        />

        <OrganizationCoursesPriceFilters
          price={price}
          setPrice={setPrice}
          estimatedPrice={estimatedPrice}
          setEstimatedPrice={setEstimatedPrice}
          debouncedPrice={debouncedPrice}
          debouncedEstimatedPrice={debouncedEstimatedPrice}
          updateRangeQuery={updateRangeQuery}
        />
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination
            pagination={pagination}
            onNext={handleNext}
            onPrevious={handlePrevious}
            itemLabel="courses"
          />
        </div>
      )}
    </div>
  );
}

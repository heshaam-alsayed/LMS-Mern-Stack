"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebounce } from "@/customHooks/useDebounce";

import OrganizationSelectFilters from "./filters/OrganizationSelectFilters";
import OrganizationSearchFilter from "./filters/OrganizationSearchFilters";

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

export default function OrganizationsFilter({ pagination }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const debouncedSearch = useDebounce(search, 1000);

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
      {/* Search + Filters */}
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        {/* Search */}
        <div className="min-w-0 flex-1">
          <OrganizationSearchFilter
            search={search}
            setSearch={setSearch}
            debouncedSearch={debouncedSearch}
            updateQuery={updateQuery}
          />
        </div>

        {/* Filters */}
        <div className="w-full sm:w-auto">
          <OrganizationSelectFilters
            searchParams={searchParams}
            updateQuery={updateQuery}
          />
        </div>

        {/* Show per page */}
        <div className="w-full sm:w-auto">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Show in page
            </label>

            <Select value={currentLimit} onValueChange={handleLimitChange}>
              <SelectTrigger className="h-9 w-full sm:w-[160px]">
                <SelectValue />
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
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination
            pagination={pagination}
            onNext={handleNext}
            onPrevious={handlePrevious}
            itemLabel="organizations"
          />
        </div>
      )}
    </div>
  );
}

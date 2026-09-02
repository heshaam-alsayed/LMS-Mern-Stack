"use client";

import { useDebounce } from "@/customHooks/useDebounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import InvoicesSearch from "./InvoicesSearch";
import Pagination from "@/components/shared/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export default function InvoicesFilters({ pagination }: Props) {
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

    // Reset page when changing search, sort, or limit
    if (key !== "page") {
      params.delete("page");
    }

    router.push(`${pathname}?${params.toString()}`);
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

  const handleSortChange = (value: string) => {
    updateQuery("sort", value);
  };

  return (
    <div className="mb-5 flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-4">
      {/* Top Controls */}
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-end">
        {/* Search */}
        <div className="min-w-0 flex-1">
          <InvoicesSearch
            search={search}
            setSearch={setSearch}
            debouncedSearch={debouncedSearch}
            updateQuery={updateQuery}
          />
        </div>

        {/* Sort By */}
        <div className="w-full lg:w-[190px]">
          <label className="mb-2 block text-xs font-medium text-foreground">
            Sort by
          </label>

          <Select
            value={searchParams.get("sort") || "-createdAt"}
            onValueChange={handleSortChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="-createdAt">Created At (Newest)</SelectItem>

              <SelectItem value="createdAt">Created At (Oldest)</SelectItem>

              <SelectItem value="-price">Amount (Highest)</SelectItem>

              <SelectItem value="price">Amount (Lowest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Limit */}
        <div className="w-full lg:w-[130px]">
          <label className="mb-2 block text-xs font-medium text-foreground">
            Show
          </label>

          <Select
            value={searchParams.get("limit") || String(pagination.limit)}
            onValueChange={handleLimitChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Show" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="5">5</SelectItem>

              <SelectItem value="10">10</SelectItem>

              <SelectItem value="15">15</SelectItem>

              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex w-full items-center justify-end border-t border-border pt-4">
          <Pagination
            pagination={pagination}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      )}
    </div>
  );
}

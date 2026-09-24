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
  updateQuery: (key: string, value: string) => void;
  paginationLimit: number;
};

export default function InvoicesFilters({ updateQuery , paginationLimit }: Props) {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const debouncedSearch = useDebounce(search, 1000);

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
            value={searchParams.get("limit") || String(paginationLimit)}
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
    </div>
  );
}

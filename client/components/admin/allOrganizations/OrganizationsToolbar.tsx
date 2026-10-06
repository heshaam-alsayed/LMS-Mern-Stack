"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import Pagination, { PaginationData } from "@/components/shared/Pagination";

import { useDebounce } from "@/customHooks/useDebounce";

type Props = {
  pagination: PaginationData | undefined;
  urlSearch: string;
  updateQuery: (key: string, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
};

export default function OrganizationsToolbar({
  pagination,
  urlSearch,
  updateQuery,
  onNext,
  onPrevious,
}: Props) {
  const [search, setSearch] = useState(urlSearch);

  const debouncedSearch = useDebounce(search, 1000);

  useEffect(() => {
    if (debouncedSearch === urlSearch) return;

    updateQuery("search", debouncedSearch);
  }, [debouncedSearch, urlSearch]);

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  const showPagination = !!pagination && pagination.totalPages > 1;

  return (
    <div className="flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
      <div className="relative w-full lg:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by organization name..."
          aria-label="Search organizations"
          className="h-10 w-full pl-9"
        />
      </div>

      {showPagination ? (
        <div className="w-full border-t border-border pt-1 lg:w-auto lg:border-0 lg:pt-0">
          <Pagination
            pagination={pagination}
            onNext={onNext}
            onPrevious={onPrevious}
            itemLabel="organizations"
          />
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import Pagination, { PaginationData } from "@/components/shared/Pagination";
import { useDebounce } from "@/customHooks/useDebounce";

type Props = {
  pagination: PaginationData | undefined;
  urlSearch: string;
  onSearch: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
};

export default function CoursesToolbar({
  pagination,
  urlSearch,
  onSearch,
  onNext,
  onPrevious,
}: Props) {
  const [search, setSearch] = useState(urlSearch);

  const debouncedSearch = useDebounce(search, 1000);

  useEffect(() => {
    if (debouncedSearch === urlSearch) return;

    onSearch(debouncedSearch);
  }, [debouncedSearch, urlSearch]);

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  return (
    <div className="flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
      <div className="relative w-full lg:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by course name..."
          aria-label="Search courses"
          className="h-10 w-full pl-9"
        />
      </div>

      {pagination && pagination.totalPages > 1 ? (
        <div className="w-full border-t border-border pt-1 lg:w-auto lg:border-0 lg:pt-0">
          <Pagination
            pagination={pagination}
            onNext={onNext}
            onPrevious={onPrevious}
            itemLabel="courses"
          />
        </div>
      ) : null}
    </div>
  );
}

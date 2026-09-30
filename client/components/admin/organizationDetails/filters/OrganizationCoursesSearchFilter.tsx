"use client";

import { Dispatch, SetStateAction, useEffect } from "react";

import { Input } from "@/components/ui/input";

interface OrganizationCoursesSearchFilterProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  debouncedSearch: string;
  updateQuery: (key: string, value: string) => void;
}

export default function OrganizationCoursesSearchFilter({
  search,
  setSearch,
  debouncedSearch,
  updateQuery,
}: OrganizationCoursesSearchFilterProps) {
  useEffect(() => {
    updateQuery("search", debouncedSearch);
  }, [debouncedSearch]);

  return (
    /* ==================== SEARCH ==================== */
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="org-courses-search"
        className="text-sm font-medium text-foreground">
        Search
      </label>

      <Input
        id="org-courses-search"
        type="text"
        placeholder="Course name or description..."
        className="h-10 w-full sm:w-[300px]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

"use client";

import { Dispatch, SetStateAction, useEffect } from "react";

import { Input } from "@/components/ui/input";

interface OrganizationSearchFilterProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  debouncedSearch: string;
  updateQuery: (key: string, value: string) => void;
}

export default function OrganizationSearchFilter({
  search,
  setSearch,
  debouncedSearch,
  updateQuery,
}: OrganizationSearchFilterProps) {
  useEffect(() => {
    updateQuery("search", debouncedSearch);
  }, [debouncedSearch]);

  return (
    <Input
      type="text"
      placeholder="Search by organization name..."
      className="h-10 w-full sm:w-[300px]"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

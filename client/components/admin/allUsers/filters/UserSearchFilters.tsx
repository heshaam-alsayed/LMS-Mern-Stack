"use client";

import { Dispatch, SetStateAction, useEffect } from "react";

import { Input } from "@/components/ui/input";

interface UserSearchFilterProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  debouncedSearch: string;
  updateQuery: (key: string, value: string) => void;
}

export default function UserSearchFilter({
  search,
  setSearch,
  debouncedSearch,
  updateQuery,
}: UserSearchFilterProps) {
  useEffect(() => {
    updateQuery("search", debouncedSearch);
  }, [debouncedSearch]);

  return (
    <Input
      type="text"
      placeholder="Search by name or email..."
      className="h-10 w-[300px]"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
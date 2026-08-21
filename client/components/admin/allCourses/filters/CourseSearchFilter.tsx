"use client";

import { Dispatch, SetStateAction, useEffect } from "react";

import { Input } from "@/components/ui/input";

interface CourseSearchFilterProps {
  search: string;

  setSearch: Dispatch<SetStateAction<string>>;

  debouncedSearch: string;

  updateQuery: (key: string, value: string) => void;
}

export default function CourseSearchFilter({
  search,
  setSearch,
  debouncedSearch,
  updateQuery,
}: CourseSearchFilterProps) {
  useEffect(() => {
    updateQuery("search", debouncedSearch);
  }, [debouncedSearch]);

  return (
    <Input
      type="text"
      placeholder="Search courses..."
      className="h-10 w-[300px]"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

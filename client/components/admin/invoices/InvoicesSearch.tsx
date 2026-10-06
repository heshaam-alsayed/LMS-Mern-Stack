"use client";

import { Dispatch, SetStateAction, useEffect } from "react";

import { Input } from "@/components/ui/input";

interface Props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  debouncedSearch: string;
  urlSearch: string;
  updateQuery: (key: string, value: string) => void;
}

export default function InvoicesSearch({
  search,
  setSearch,
  debouncedSearch,
  urlSearch,
  updateQuery,
}: Props) {
  useEffect(() => {
    if (debouncedSearch === urlSearch) return;

    updateQuery("search", debouncedSearch);
  }, [debouncedSearch, urlSearch]);

  return (
    <Input
      type="text"
      placeholder="Search by userName or courseName..."
      className="h-10 w-full sm:w-[300px]"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

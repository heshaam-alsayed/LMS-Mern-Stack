"use client";

import { Dispatch, SetStateAction, useEffect } from "react";

import { Input } from "@/components/ui/input";

interface Props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  debouncedSearch: string;
  updateQuery: (key: string, value: string) => void;
}

export default function InvoicesSearch({
  search,
  setSearch,
  debouncedSearch,
  updateQuery,
}: Props) {
  useEffect(() => {
    updateQuery("search", debouncedSearch);
  }, [debouncedSearch]);

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

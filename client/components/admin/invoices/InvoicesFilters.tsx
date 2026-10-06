"use client";

import { FileText } from "lucide-react";
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
  total: number;
};

export default function InvoicesFilters({
  updateQuery,
  paginationLimit,
  total,
}: Props) {
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
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card">

      <div className="relative flex w-full flex-col gap-5 p-5 sm:p-6">
        <div className="flex w-full min-w-0 items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Invoices
              </h1>

              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {total.toLocaleString()}
              </span>
            </div>

            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
              Every paid order and its billing record across the platform.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1">
            <InvoicesSearch
              search={search}
              setSearch={setSearch}
              debouncedSearch={debouncedSearch}
              urlSearch={searchParams.get("search") || ""}
              updateQuery={updateQuery}
            />
          </div>

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
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useDebounce } from "@/customHooks/useDebounce";

import OrganizationStudentsFilterSheet from "./OrganizationStudentsFilterSheet";

const DEFAULT_LIMIT = "10";

const FILTER_KEYS = ["sort", "limit"];

export default function OrganizationStudentsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const debouncedSearch = useDebounce(search, 1000);

  const push = (params: URLSearchParams) => {
    const query = params.toString();

    if (query === searchParams.toString()) {
      return;
    }

    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.delete("page");

    push(params);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    params.delete("page");

    push(params);
  }, [debouncedSearch]);

  const resetAll = () => {
    setSearch("");

    push(new URLSearchParams());
  };

  const activeCount = FILTER_KEYS.filter((key) => searchParams.get(key)).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-[340px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="text"
            placeholder="Search students by name..."
            aria-label="Search students"
            className="h-10 pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setIsSheetOpen(true)}
          className="h-10 w-full sm:w-auto">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
          {activeCount > 0 ? (
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
              {activeCount}
            </span>
          ) : null}
        </Button>

        {activeCount > 0 ? (
          <Button
            type="button"
            variant="ghost"
            onClick={resetAll}
            className="h-10 text-muted-foreground hover:text-foreground">
            Clear all
          </Button>
        ) : null}
      </div>

      <OrganizationStudentsFilterSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        sort={searchParams.get("sort") || undefined}
        limit={searchParams.get("limit") || DEFAULT_LIMIT}
        activeCount={activeCount}
        onSortChange={(value) => updateQuery("sort", value)}
        onLimitChange={(value) => updateQuery("limit", value)}
        onReset={resetAll}
      />
    </div>
  );
}

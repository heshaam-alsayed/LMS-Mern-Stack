"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ListFilter,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { useDebounce } from "@/customHooks/useDebounce";

import Pagination, { PaginationData } from "@/components/shared/Pagination";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import UserSelectFilters from "./filters/UserSelectFilters";

type Props = {
  pagination: PaginationData;
  onClickAdd: () => void;
};

const LIMIT_OPTIONS = [5, 10, 15, 20];

const FILTER_KEYS = ["role", "isVerified", "sort", "search", "limit", "page"];

export default function UsersFilter({ pagination, onClickAdd }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 1000);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key !== "page") {
      params.delete("page");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (debouncedSearch === (searchParams.get("search") || "")) return;

    updateQuery("search", debouncedSearch);
  }, [debouncedSearch]);

  const handleNext = () => {
    if (!pagination.hasNextPage) return;

    updateQuery("page", String(pagination.currentPage + 1));
  };

  const handlePrevious = () => {
    if (!pagination.hasPreviousPage) return;

    updateQuery("page", String(pagination.currentPage - 1));
  };

  const handleReset = () => {
    setSearch("");

    router.push(pathname);
    setIsFilterOpen(false);
  };

  const currentLimit = searchParams.get("limit") || "10";
  const isTeam = pathname.includes("/team");

  const hasActiveFilters = FILTER_KEYS.some(
    (key) => key !== "limit" && key !== "page" && searchParams.has(key),
  );

  return (
    <div className="space-y-3">
      <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card">

        <div className="relative flex w-full flex-col gap-5 p-5 sm:p-6">
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {isTeam ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : (
                  <UsersRound className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-lg font-semibold tracking-tight text-foreground">
                    {isTeam ? "Team members" : "Users"}
                  </h1>

                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {pagination.total.toLocaleString()}
                  </span>
                </div>

                <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                  {isTeam
                    ? "Manage admins and staff accounts with platform access."
                    : "Review, verify and manage every account on the platform."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or email..."
                aria-label="Search by name or email"
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40"
              />
            </div>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 gap-2 sm:shrink-0"
                  aria-label="Open filters">
                  <ListFilter className="h-4 w-4" />

                  Filters

                  {hasActiveFilters ? (
                    <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      Active
                    </span>
                  ) : null}
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md">
                <SheetHeader className="border-b border-border p-5">
                  <SheetTitle>Filters</SheetTitle>

                  <SheetDescription>
                    Narrow the list by role, verification and sorting.
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-5 p-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Show in page
                    </label>

                    <Select
                      value={currentLimit}
                      onValueChange={(value) =>
                        updateQuery("limit", value)
                      }>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent className="w-full">
                        {LIMIT_OPTIONS.map((limit) => (
                          <SelectItem key={limit} value={String(limit)}>
                            {limit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <UserSelectFilters
                    searchParams={searchParams}
                    updateQuery={updateQuery}
                  />
                </div>

                <SheetFooter className="border-t border-border p-5">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />

                    Reset filters
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

          <Button onClick={onClickAdd} className="h-10 gap-2 sm:shrink-0">
            <Plus className="h-4 w-4" />

            Add New Member
          </Button>
          </div>
        </div>
      </div>

      {pagination.totalPages > 1 ? (
        <div>
          <Pagination
            pagination={pagination}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      ) : null}
    </div>
  );
}

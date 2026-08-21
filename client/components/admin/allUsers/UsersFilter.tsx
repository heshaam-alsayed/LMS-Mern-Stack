"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebounce } from "@/customHooks/useDebounce";

import UserSelectFilters from "./filters/UserSelectFilters";
import UserSearchFilter from "./filters/UserSearchFilters";

import Pagination, { PaginationData } from "@/components/shared/Pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";


type Props = {
  pagination: PaginationData;
  onClickAdd: () => void;
};

const LIMIT_OPTIONS = [5, 10, 15, 20];

export default function UsersFilter({
  pagination,
  onClickAdd,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const debouncedSearch = useDebounce(search, 1000);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Reset page whenever filter/search/limit changes
    if (key !== "page") {
      params.delete("page");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // ==================== PAGINATION ====================

  const handleNext = () => {
    if (!pagination.hasNextPage) return;

    updateQuery("page", String(pagination.currentPage + 1));
  };

  const handlePrevious = () => {
    if (!pagination.hasPreviousPage) return;

    updateQuery("page", String(pagination.currentPage - 1));
  };

  // ==================== LIMIT ====================

  const handleLimitChange = (value: string) => {
    updateQuery("limit", value);
  };

  const currentLimit = searchParams.get("limit") || "10";
  const isTeam = pathname.includes("/team");

  return (
    <div className="space-y-3">
      {/* ==================== SELECT FILTERS ==================== */}

      {isTeam ? (
        <div className="flex items-center gap-4">
          <UserSelectFilters
            searchParams={searchParams}
            updateQuery={updateQuery}
          />
          <div className="flex flex-col  gap-2">
            <label className="text-sm font-medium text-foreground">
              Show in page
            </label>

            <Select value={currentLimit} onValueChange={handleLimitChange}>
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className=" w-[160px]">
                {LIMIT_OPTIONS.map((limit) => (
                  <SelectItem key={limit} value={String(limit)}>
                    {limit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6">
            <UserSearchFilter
              search={search}
              setSearch={setSearch}
              debouncedSearch={debouncedSearch}
              updateQuery={updateQuery}
            />
          </div>
        </div>
      ) : (
        <UserSelectFilters
          searchParams={searchParams}
          updateQuery={updateQuery}
        />
      )}

      <div className="flex items-center justify-between gap-3">
        {/* Search */}
        {!isTeam && (
          <UserSearchFilter
            search={search}
            setSearch={setSearch}
            debouncedSearch={debouncedSearch}
            updateQuery={updateQuery}
          />
        )}

        <div className=" flex items-center justify-between w-full gap-3">
          <Button onClick={onClickAdd} className="h-9 gap-2">
            <Plus className="h-4 w-4" />
            Add New Member
          </Button>
          {pagination.totalPages > 1 && (
            <div>
              <Pagination
                pagination={pagination}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}

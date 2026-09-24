"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export interface PaginationData {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginationProps {
  pagination: PaginationData | undefined;
  onNext: () => void;
  onPrevious: () => void;
  itemLabel?: string;
}

export default function Pagination({
  pagination,
  onNext,
  onPrevious,
  itemLabel,
}: PaginationProps) {
  const pathName = usePathname();
  const isTeam = pathName.includes("/team");
  if (!pagination) return;
  const { currentPage, total, totalPages, hasNextPage, hasPreviousPage } =
    pagination;
  const label = itemLabel ?? (isTeam ? "admin" : "users");
  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:gap-x-6">
      <p className="min-w-0 flex-1 truncate text-center text-sm text-muted-foreground sm:text-left">
        Page <span className="font-medium text-foreground">{currentPage}</span>{" "}
        of <span className="font-medium text-foreground">{totalPages}</span>
        {" • "}
        <span className="font-medium text-foreground">{total}</span>{" "}
        {label}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!hasPreviousPage}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!hasNextPage}>
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

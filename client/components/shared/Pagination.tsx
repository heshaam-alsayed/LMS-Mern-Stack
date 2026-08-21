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
  pagination: PaginationData;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Pagination({
  pagination,
  onNext,
  onPrevious,
}: PaginationProps) {
  const { currentPage, total, totalPages, hasNextPage, hasPreviousPage } =
    pagination;
const pathName = usePathname();
  const isTeam = pathName.includes("/team");
  return (
    <div className="flex items-center justify-between gap-4  px-4 py-3">
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{currentPage}</span>{" "}
        of <span className="font-medium text-foreground">{totalPages}</span>
        {" • "}
        <span className="font-medium text-foreground">{total}</span> {isTeam ? "admin" : "users"}
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

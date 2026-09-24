import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { InstructorApplicationsPagination as Pagination } from "@/types/instructorApplication.type";

type Props = {
  pagination: Pagination;
  isFetching: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export default function InstructorApplicationsPagination({
  pagination,
  isFetching,
  onPrevious,
  onNext,
}: Props) {
  return (
    <section className="flex flex-col gap-4 border-t border-border/60 pt-5 sm:flex-row sm:items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Page 
        <span className="font-medium text-foreground px-1">
          {pagination.currentPage}
        </span>
        of 
        <span className="font-medium text-foreground px-1">
          {pagination.totalPages}
        </span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!pagination.hasPreviousPage || isFetching}
          className="gap-1.5">
          <ChevronLeft className="size-4" />
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!pagination.hasNextPage || isFetching}
          className="gap-1.5">
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

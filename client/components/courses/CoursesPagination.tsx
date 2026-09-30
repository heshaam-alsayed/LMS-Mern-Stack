import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  totalCourses: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
};

export default function CoursesPagination({
  currentPage,
  totalPages,
  totalCourses,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
        <span>
          {totalCourses} {totalCourses === 1 ? "course" : "courses"}
        </span>

        <span className="text-border">•</span>

        <span>
          Page{" "}
          <span className="font-medium text-foreground">{currentPage}</span> of{" "}
          <span className="font-medium text-foreground">{totalPages}</span>
        </span>
      </div>

      <button
        type="button"
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
        className="
          inline-flex
          size-9
          cursor-pointer
          items-center
          justify-center
          rounded-full
          border
          border-border
          bg-muted
          text-foreground
          shadow-sm
          transition-colors
          hover:bg-accent
          disabled:cursor-not-allowed
          disabled:opacity-40
        ">
        <ChevronLeft className="size-4.5" />
      </button>

      <div
        className="
          inline-flex
          size-9
          items-center
          justify-center
          rounded-full
          border
          border-border
          bg-background
          text-sm
          font-semibold
          text-foreground
          shadow-sm
        ">
        {currentPage}
      </div>

      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
        className="
          inline-flex
          size-9
          cursor-pointer
          items-center
          justify-center
          rounded-full
          border
          border-primary
          bg-primary
          text-primary-foreground
          shadow-sm
          transition-colors
          hover:bg-primary/90
          disabled:cursor-not-allowed
          disabled:opacity-40
        ">
        <ChevronRight className="size-4.5" />
      </button>
    </div>
  );
}

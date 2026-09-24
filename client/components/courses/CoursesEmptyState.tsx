import { BookOpen, RotateCcw, Search } from "lucide-react";

type Props = {
  onReset: () => void;
  onSearch: () => void;
};

export default function CoursesEmptyState({
  onReset,
  onSearch,
}: Props) {
  return (
    <div className="flex min-h-[520px] -mt-30 items-center justify-center">
      <div className="w-full max-w-xl overflow-hidden  p-8 text-center  sm:p-10">
        <div className="relative">
          {/* Icon */}
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <BookOpen className="size-8 text-primary" />
          </div>

          <div className="mx-auto mt-6 max-w-md">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              No courses found
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              We couldn&apos;t find any courses matching your current
              filters. Try adjusting your search or exploring all
              available courses.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onReset}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-md
                bg-primary
                px-5
                text-sm
                font-medium
                text-primary-foreground
                shadow-sm
                transition-all
                hover:bg-primary/90
              "
            >
              <RotateCcw className="size-4" />
              Clear filters
            </button>

            <button
              type="button"
              onClick={onSearch}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-md
                border
                border-border
                bg-background
                px-5
                text-sm
                font-medium
                text-foreground
                transition-colors
                hover:bg-muted
              "
            >
              <Search className="size-4" />
              Search courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
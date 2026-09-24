"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Category = {
  _id: string;
  title: string;
  slug: string;
};

type Props = {
  categories: Category[];
  activeCategory: string;
  updateQuery: (key: string, value: string) => void;
};

const VISIBLE_CATEGORIES = 5;

export default function CoursesCategories({
  categories,
  activeCategory,
  updateQuery,
}: Props) {
  const [startIndex, setStartIndex] = useState(0);

  const visibleCategories = categories.slice(
    startIndex,
    startIndex + VISIBLE_CATEGORIES,
  );

  const hasPrevious = startIndex > 0;
  const hasNext = startIndex + VISIBLE_CATEGORIES < categories.length;

  const handlePrevious = () => {
    if (!hasPrevious) return;

    setStartIndex(Math.max(0, startIndex - VISIBLE_CATEGORIES));
  };

  const handleNext = () => {
    if (!hasNext) return;

    setStartIndex(
      Math.min(
        categories.length - VISIBLE_CATEGORIES,
        startIndex + VISIBLE_CATEGORIES,
      ),
    );
  };

  return (
    <div className="flex min-w-0 items-center gap-2">
      {/* Previous */}
      <button
        type="button"
        onClick={handlePrevious}
        disabled={!hasPrevious}
        aria-label="Previous categories"
        className="
  group
  inline-flex
  size-9
  shrink-0
  cursor-pointer
  items-center
  justify-center
  rounded-full
  !border
  !border-border
  bg-muted
  text-foreground
  shadow-sm
  transition-all
  duration-200
  hover:!border-foreground/30
  hover:!bg-accent
  hover:text-foreground
  active:scale-95
  disabled:cursor-not-allowed
  disabled:opacity-40
  disabled:hover:!border-border
  disabled:hover:!bg-muted
">
        <ChevronLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
      </button>

      {/* Categories */}
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
        {/* All */}
        <button
          type="button"
          onClick={() => updateQuery("category", "all")}
          className={`
            inline-flex
            h-9
            shrink-0
            cursor-pointer
            items-center
            justify-center
            rounded-full
            !border
            px-4
            text-[13px]
            font-semibold
            tracking-[-0.01em]
            transition-all
            duration-200
            active:scale-[0.97]
            ${
              activeCategory === "all"
                ? "!border-primary bg-primary text-primary-foreground shadow-sm"
                : "!border-border bg-background text-muted-foreground hover:!border-foreground/30 hover:!bg-muted hover:text-foreground"
            }
          `}>
          All Courses
        </button>

        {visibleCategories.map((category) => {
          const isActive = activeCategory === category._id;

          return (
            <button
              key={category._id}
              type="button"
              onClick={() => updateQuery("category", category._id)}
              title={category.title}
              className={`
                inline-flex
                h-9
                max-w-40
                shrink-0
                cursor-pointer
                items-center
                justify-center
                truncate
                rounded-full
                !border
                px-4
                text-[13px]
                font-semibold
                tracking-[-0.01em]
                transition-all
                duration-200
                active:scale-[0.97]
                capitalize
                ${
                  isActive
                    ? "!border-primary bg-primary text-primary-foreground shadow-sm"
                    : "!border-border bg-background text-muted-foreground hover:!border-foreground/30 hover:!bg-muted hover:text-foreground"
                }
              `}>
              {category.title}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={handleNext}
        disabled={!hasNext}
        aria-label="Next categories"
        className="
  group
  inline-flex
  size-9
  shrink-0
  cursor-pointer
  items-center
  justify-center
  rounded-full
  !border
  !border-border
  bg-muted
  text-foreground
  shadow-sm
  transition-all
  duration-200
  hover:!border-foreground/30
  hover:!bg-accent
  hover:text-foreground
  active:scale-95
  disabled:cursor-not-allowed
  disabled:opacity-40
  disabled:hover:!border-border
  disabled:hover:!bg-muted
">
        <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

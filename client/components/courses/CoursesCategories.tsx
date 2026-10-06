"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
const MAX_TITLE_LENGTH = 22;

// category titles are long so a title longer than 22
// ellipsis is added the full title stays available on hover
// attribute of the button
const shorten = (value: string) =>
  value.length > MAX_TITLE_LENGTH
    ? `${value.slice(0, MAX_TITLE_LENGTH).trimEnd()}...`
    : value;

export default function CoursesCategories({
  categories,
  activeCategory,
  updateQuery,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  const [startIndex, setStartIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [sliding, setSliding] = useState(false);

  const lastStartIndex = Math.max(0, categories.length - VISIBLE_CATEGORIES);
  const safeStartIndex = Math.min(startIndex, lastStartIndex);

  // the row moves as one piece so the chips slide
  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const firstVisible = track.children[safeStartIndex] as HTMLElement | undefined;

    if (firstVisible) {
      setOffset(firstVisible.offsetLeft);
    }

    setSliding(true);
  }, [safeStartIndex, categories.length]);

  // keep the selected category visible after the filter changes
  useEffect(() => {
    if (activeCategory === "all" || !categories.length) {
      return;
    }

    const index = categories.findIndex(
      (category) => category._id === activeCategory,
    );

    if (index < 0) {
      return;
    }

    setStartIndex((current) => {
      const start = Math.min(current, lastStartIndex);

      if (index >= start && index < start + VISIBLE_CATEGORIES) {
        return start;
      }

      return Math.min(Math.max(0, index), lastStartIndex);
    });
  }, [activeCategory, categories, lastStartIndex]);

  const hasPrevious = safeStartIndex > 0;
  const hasNext = safeStartIndex + VISIBLE_CATEGORIES < categories.length;

  const handlePrevious = () => {
    if (!hasPrevious) {
      return;
    }

    setStartIndex(Math.max(0, safeStartIndex - VISIBLE_CATEGORIES));
  };

  const handleNext = () => {
    if (!hasNext) {
      return;
    }

    setStartIndex(Math.min(lastStartIndex, safeStartIndex + VISIBLE_CATEGORIES));
  };

  return (
    <div className="flex min-w-0 items-center gap-2">
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
            whitespace-nowrap
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

      <div className="min-w-0 flex-1 overflow-hidden">
        <div
          ref={trackRef}
          style={{ transform: `translateX(-${offset}px)` }}
          className={`flex items-center gap-2 ${
            sliding ? "transition-transform duration-500 ease-out" : ""
          }`}>
          {categories.map((category) => {
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
                max-w-56
                shrink-0
                cursor-pointer
                items-center
                justify-center
                whitespace-nowrap
                rounded-full
                !border
                px-4
                text-[13px]
                font-semibold
                tracking-[-0.01em]
                transition-all
                duration-300
                hover:-translate-y-0.5
                active:scale-[0.97]
                capitalize
                ${
                  isActive
                    ? "!border-primary bg-primary text-primary-foreground shadow-sm"
                    : "!border-border bg-background text-muted-foreground hover:!border-foreground/30 hover:!bg-muted hover:text-foreground"
                }
              `}>
                {shorten(category.title)}
              </button>
            );
          })}
        </div>
      </div>

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

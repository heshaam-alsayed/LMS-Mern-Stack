"use client";

import { ListFilter, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import CoursePriceRangeFilter from "./filters/CoursePriceRangeFilter";
import CourseSelectFilters from "./filters/CourseSelectFilters";

type Props = {
  status: string;
  level: string;
  ratings: string;
  purchased: string;
  sort: string;
  limit: string;
  priceMin: number;
  priceMax: number;
  estimatePriceMin: number;
  estimatePriceMax: number;
  hasActiveFilters: boolean;
  onChange: (key: string, value: string) => void;
  onRangeChange: (field: string, min: number, max: number) => void;
  onReset: () => void;
};

export default function CoursesFiltersSheet({
  status,
  level,
  ratings,
  purchased,
  sort,
  limit,
  priceMin,
  priceMax,
  estimatePriceMin,
  estimatePriceMax,
  hasActiveFilters,
  onChange,
  onRangeChange,
  onReset,
}: Props) {
  return (
    <Sheet>
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
            Narrow the list by status, level, rating, price and sorting.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 p-5">
          <CourseSelectFilters
            status={status}
            level={level}
            ratings={ratings}
            purchased={purchased}
            sort={sort}
            limit={limit}
            onChange={onChange}
          />

          <div className="h-px bg-border" />

          <CoursePriceRangeFilter
            label="Price range"
            urlMin={priceMin}
            urlMax={priceMax}
            onCommit={(min, max) => onRangeChange("price", min, max)}
          />

          <CoursePriceRangeFilter
            label="Estimated price"
            urlMin={estimatePriceMin}
            urlMax={estimatePriceMax}
            onCommit={(min, max) => onRangeChange("estimatePrice", min, max)}
          />
        </div>

        <SheetFooter className="border-t border-border p-5">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={onReset}>
            <RotateCcw className="h-4 w-4" />

            Reset filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

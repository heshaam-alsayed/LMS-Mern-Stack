"use client";

import { BookOpen, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

import CoursesFiltersSheet from "./CoursesFiltersSheet";

type Props = {
  total: number;
  hasActiveFilters: boolean;
  onChange: (key: string, value: string) => void;
  onRangeChange: (field: string, min: number, max: number) => void;
  onReset: () => void;
  filters: {
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
  };
};

export default function CoursesHeader({
  total,
  hasActiveFilters,
  onChange,
  onRangeChange,
  onReset,
  filters,
}: Props) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative flex w-full flex-col gap-5 p-5 sm:p-6">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                  Courses
                </h1>

                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {total.toLocaleString()}
                </span>
              </div>

              <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                Review, publish and manage every course on the platform.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <CoursesFiltersSheet
              status={filters.status}
              level={filters.level}
              ratings={filters.ratings}
              purchased={filters.purchased}
              sort={filters.sort}
              limit={filters.limit}
              priceMin={filters.priceMin}
              priceMax={filters.priceMax}
              estimatePriceMin={filters.estimatePriceMin}
              estimatePriceMax={filters.estimatePriceMax}
              hasActiveFilters={hasActiveFilters}
              onChange={onChange}
              onRangeChange={onRangeChange}
              onReset={onReset}
            />

            <Button
              variant="outline"
              className="h-10 gap-2 sm:shrink-0 bg-muted"
              onClick={onReset}
              disabled={!hasActiveFilters}>
              <RotateCcw className="h-4 w-4" />

              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

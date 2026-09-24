"use client";

import {
  AlertCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import TopCoursesSellingSkeleton from "@/components/skeleton/TopCoursesSellingSkeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Course = {
  _id: string;
  name: string;
  price: number;
  purchased: number;
};

type Props = {
  courses?: Course[];
  isLoading: boolean;
  isError: boolean;
  error?: string | null;
  limit: number;
  onLimitChange: (limit: number) => void;
};

export default function TopSellingCourses({
  isLoading,
  isError,
  error,
  limit,
  onLimitChange,
  courses = [],
}: Props) {
  const PAGE_SIZE = 5;

  const limitOptions = [5, 10, 20, 50, 100];

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil(courses.length / PAGE_SIZE),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [limit]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);


  const currentCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    return courses.slice(startIndex, endIndex);
  }, [courses, currentPage]);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const startItem =
    courses.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const endItem = Math.min(
    currentPage * PAGE_SIZE,
    courses.length,
  );

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Trophy className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">
              Top Selling Courses
            </h3>

            <p className="text-xs text-muted-foreground">
              Courses with the highest number of sales
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={String(limit)}
            onValueChange={(value) => {
              onLimitChange(Number(value));
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[100px] text-xs">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>

            <SelectContent>
              {limitOptions.map((option) => (
                <SelectItem
                  key={option}
                  value={String(option)}
                >
                  Top {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex-1">
          <TopCoursesSellingSkeleton />
        </div>
      ) : isError ? (
        /* Error */
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-foreground">
            Failed to load courses
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
            {error ||
              "Something went wrong while fetching top selling courses."}
          </p>
        </div>
      ) : courses.length === 0 ? (
        /* Empty */
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Trophy className="h-5 w-5" />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-foreground">
            No sales data available
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
            Top selling courses will appear here once
            customers start purchasing courses.
          </p>
        </div>
      ) : (
        <>
          {/* Courses */}
          <div className="flex-1 divide-y divide-border overflow-hidden">
            {currentCourses.map((course, index) => {
              const globalIndex =
                (currentPage - 1) * PAGE_SIZE + index + 1;

              const revenue =
                course.price * course.purchased;

              return (
                <div
                  key={course._id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  {/* Rank */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {globalIndex}
                  </div>

                  {/* Course */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {course.name}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      ${course.price.toLocaleString()} per
                      course
                    </p>
                  </div>

                  {/* Sales */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {course.purchased.toLocaleString()}
                    </p>

                    <p className="text-[11px] text-muted-foreground">
                      {course.purchased === 1
                        ? "sale"
                        : "sales"}
                    </p>
                  </div>

                  {/* Revenue */}
                  <div className="hidden w-24 shrink-0 text-right sm:block">
                    <p className="text-sm font-semibold text-foreground">
                      ${revenue.toLocaleString()}
                    </p>

                    <p className="text-[11px] text-muted-foreground">
                      revenue
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-auto flex shrink-0 items-center justify-between border-t border-border px-4 py-3">
            {/* Showing */}
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {startItem}
              </span>{" "}
              -{" "}
              <span className="font-medium text-foreground">
                {endItem}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {courses.length}
              </span>
            </p>

            {/* Navigation */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="min-w-[60px] text-center text-xs font-medium text-foreground">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
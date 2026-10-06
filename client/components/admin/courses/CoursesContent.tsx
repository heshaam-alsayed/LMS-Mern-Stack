"use client";

import { useSearchParams } from "next/navigation";

import CoursesHeader from "./CoursesHeader";
import CoursesTable from "./CoursesTable";
import CoursesToolbar from "./CoursesToolbar";
import useAdminCourses from "./hooks/useAdminCourses";

import { FILTER_KEYS, RANGE_MAX, RANGE_MIN } from "./constants";

const toRangeValue = (value: string | null, fallback: number) => {
  if (!value) return fallback;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function CoursesContent() {
  const searchParams = useSearchParams();

  const {
    courses,
    pagination,
    isFetching,
    error,
    status,
    level,
    ratings,
    purchased,
    sort,
    limit,
    urlSearch,
    updateQuery,
    updateRangeQuery,
    resetFilters,
    handleNext,
    handlePrevious,
  } = useAdminCourses();

  const total = pagination?.total ?? 0;
  const showFilters = total > 0;

  const hasActiveFilters = FILTER_KEYS.some((key) => searchParams.has(key));

  return (
    <div className="space-y-4">
      {showFilters ? (
        <>
          <CoursesHeader
            total={total}
            hasActiveFilters={hasActiveFilters}
            onChange={updateQuery}
            onRangeChange={updateRangeQuery}
            onReset={resetFilters}
            filters={{
              status,
              level,
              ratings,
              purchased,
              sort,
              limit,
              priceMin: toRangeValue(searchParams.get("price[gte]"), RANGE_MIN),
              priceMax: toRangeValue(searchParams.get("price[lte]"), RANGE_MAX),
              estimatePriceMin: toRangeValue(
                searchParams.get("estimatePrice[gte]"),
                RANGE_MIN,
              ),
              estimatePriceMax: toRangeValue(
                searchParams.get("estimatePrice[lte]"),
                RANGE_MAX,
              ),
            }}
          />

          <CoursesToolbar
            pagination={pagination}
            urlSearch={urlSearch}
            onSearch={(value) => updateQuery("search", value)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </>
      ) : null}

      <CoursesTable
        courses={courses}
        isLoading={isFetching && !courses.length}
        error={error}
      />
    </div>
  );
}

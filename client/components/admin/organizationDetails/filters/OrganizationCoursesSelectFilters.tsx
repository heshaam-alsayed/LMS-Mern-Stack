"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrganizationCoursesSelectFiltersProps {
  searchParams: URLSearchParams;
  updateQuery: (key: string, value: string) => void;
}

export default function OrganizationCoursesSelectFilters({
  searchParams,
  updateQuery,
}: OrganizationCoursesSelectFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      {/* ==================== LEVEL ==================== */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="org-courses-level"
          className="text-sm font-medium text-foreground">
          Level
        </label>

        <Select
          value={searchParams.get("level") || "all"}
          onValueChange={(value) => updateQuery("level", value)}>
          <SelectTrigger id="org-courses-level" className="h-10 w-full sm:w-[180px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>

            <SelectItem value="beginner">Beginner</SelectItem>

            <SelectItem value="intermediate">Intermediate</SelectItem>

            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ==================== RATING ==================== */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="org-courses-rating"
          className="text-sm font-medium text-foreground">
          Rating
        </label>

        <Select
          value={searchParams.get("ratings[gte]") || "all"}
          onValueChange={(value) => updateQuery("ratings[gte]", value)}>
          <SelectTrigger id="org-courses-rating" className="h-10 w-full sm:w-[180px]">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>

            <SelectItem value="5">5 Stars</SelectItem>

            <SelectItem value="4">4+ Stars</SelectItem>

            <SelectItem value="3">3+ Stars</SelectItem>

            <SelectItem value="2">2+ Stars</SelectItem>

            <SelectItem value="1">1+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ==================== PURCHASED ==================== */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="org-courses-purchased"
          className="text-sm font-medium text-foreground">
          Purchased
        </label>

        <Select
          value={searchParams.get("purchased[gte]") || "all"}
          onValueChange={(value) => updateQuery("purchased[gte]", value)}>
          <SelectTrigger
            id="org-courses-purchased"
            className="h-10 w-full sm:w-[180px]">
            <SelectValue placeholder="Purchased" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>

            <SelectItem value="10">10+ Purchases</SelectItem>

            <SelectItem value="50">50+ Purchases</SelectItem>

            <SelectItem value="100">100+ Purchases</SelectItem>

            <SelectItem value="500">500+ Purchases</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ==================== SORT ==================== */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="org-courses-sort"
          className="text-sm font-medium text-foreground">
          Sort by
        </label>

        <Select
          value={searchParams.get("sort") || "all"}
          onValueChange={(value) => updateQuery("sort", value)}>
          <SelectTrigger id="org-courses-sort" className="h-10 w-full sm:w-[180px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Latest</SelectItem>

            <SelectItem value="price">Price: Low to High</SelectItem>

            <SelectItem value="-price">Price: High to Low</SelectItem>

            <SelectItem value="estimatePrice">Estimate: Low to High</SelectItem>

            <SelectItem value="-estimatePrice">Estimate: High to Low</SelectItem>

            <SelectItem value="ratings">Rating: Low to High</SelectItem>

            <SelectItem value="-ratings">Rating: High to Low</SelectItem>

            <SelectItem value="-purchased">Most Purchased</SelectItem>

            <SelectItem value="createdAt">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

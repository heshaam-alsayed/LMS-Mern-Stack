"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourseSelectFiltersProps {
  searchParams: URLSearchParams;
  updateQuery: (key: string, value: string) => void;
}

export default function CourseSelectFilters({
  searchParams,
  updateQuery,
}: CourseSelectFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {/* ==================== LEVEL ==================== */}

      <Select
        value={searchParams.get("level") || "all"}
        onValueChange={(value) => updateQuery("level", value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Level" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>

          <SelectItem value="beginner">Beginner</SelectItem>

          <SelectItem value="intermediate">Intermediate</SelectItem>

          <SelectItem value="advanced">Advanced</SelectItem>
        </SelectContent>
      </Select>

      {/* ==================== RATINGS ==================== */}

      <Select
        value={searchParams.get("ratings[gte]") || "all"}
        onValueChange={(value) => updateQuery("ratings[gte]", value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
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

      {/* ==================== PURCHASED ==================== */}

      <Select
        value={searchParams.get("purchased[gte]") || "all"}
        onValueChange={(value) => updateQuery("purchased[gte]", value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
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

      {/* ==================== SORT ==================== */}

      <Select
        value={searchParams.get("sort") || "all"}
        onValueChange={(value) => updateQuery("sort", value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Latest</SelectItem>

          <SelectItem value="price">Price: Low to High</SelectItem>

          <SelectItem value="-price">Price: High to Low</SelectItem>

          <SelectItem value="ratings">Rating: Low to High</SelectItem>

          <SelectItem value="-ratings">Rating: High to Low</SelectItem>

          <SelectItem value="-purchased">Most Purchased</SelectItem>

          <SelectItem value="createdAt">Oldest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

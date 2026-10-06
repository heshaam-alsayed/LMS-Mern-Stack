"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { LIMIT_OPTIONS } from "../constants";

type Props = {
  status: string;
  level: string;
  ratings: string;
  purchased: string;
  sort: string;
  limit: string;
  onChange: (key: string, value: string) => void;
};

const selectClass = "h-10 w-full";

export default function CourseSelectFilters({
  status,
  level,
  ratings,
  purchased,
  sort,
  limit,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Status</label>

        <Select value={status} onValueChange={(value) => onChange("status", value)}>
          <SelectTrigger className={selectClass} aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent className="w-full">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Level</label>

        <Select value={level} onValueChange={(value) => onChange("level", value)}>
          <SelectTrigger className={selectClass} aria-label="Filter by level">
            <SelectValue placeholder="Level" />
          </SelectTrigger>

          <SelectContent className="w-full">
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Rating</label>

        <Select
          value={ratings}
          onValueChange={(value) => onChange("ratings[gte]", value)}>
          <SelectTrigger className={selectClass} aria-label="Filter by rating">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>

          <SelectContent className="w-full">
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
            <SelectItem value="2">2+ Stars</SelectItem>
            <SelectItem value="1">1+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Purchased</label>

        <Select
          value={purchased}
          onValueChange={(value) => onChange("purchased[gte]", value)}>
          <SelectTrigger className={selectClass} aria-label="Filter by purchases">
            <SelectValue placeholder="Purchased" />
          </SelectTrigger>

          <SelectContent className="w-full">
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="10">10+ Purchases</SelectItem>
            <SelectItem value="50">50+ Purchases</SelectItem>
            <SelectItem value="100">100+ Purchases</SelectItem>
            <SelectItem value="500">500+ Purchases</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Sort by</label>

        <Select value={sort} onValueChange={(value) => onChange("sort", value)}>
          <SelectTrigger className={selectClass} aria-label="Sort courses">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>

          <SelectContent className="w-full">
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

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Show in page
        </label>

        <Select value={limit} onValueChange={(value) => onChange("limit", value)}>
          <SelectTrigger className={selectClass} aria-label="Rows per page">
            <SelectValue />
          </SelectTrigger>

          <SelectContent className="w-full">
            {LIMIT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

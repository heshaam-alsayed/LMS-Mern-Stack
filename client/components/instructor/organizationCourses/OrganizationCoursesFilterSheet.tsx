"use client";

import { useEffect, useState } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

const MIN_PRICE = 0;
const MAX_PRICE = 5000;
const PRICE_STEP = 10;

const LIMIT_OPTIONS = [10, 20, 50, 100];

interface OrganizationCoursesFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  level: string;
  rating: string;
  purchased: string;
  sort: string;
  limit: string;

  priceMin: string;
  priceMax: string;

  activeCount: number;

  onLevelChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onPurchasedChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onLimitChange: (value: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onReset: () => void;
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-foreground">{children}</p>;
}

function FilterGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export default function OrganizationCoursesFilterSheet({
  open,
  onOpenChange,
  level,
  rating,
  purchased,
  sort,
  limit,
  priceMin,
  priceMax,
  activeCount,
  onLevelChange,
  onRatingChange,
  onPurchasedChange,
  onSortChange,
  onLimitChange,
  onPriceChange,
  onReset,
}: OrganizationCoursesFilterSheetProps) {
  const [price, setPrice] = useState<[number, number]>([
    Number(priceMin) || MIN_PRICE,
    Number(priceMax) || MAX_PRICE,
  ]);

  useEffect(() => {
    setPrice([Number(priceMin) || MIN_PRICE, Number(priceMax) || MAX_PRICE]);
  }, [priceMin, priceMax, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-[380px]">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Filters
          </SheetTitle>

          <SheetDescription className="text-xs leading-5">
            Narrow down the courses of your organization.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          <FilterGroup>
            <FilterLabel>Level</FilterLabel>

            <Select value={level} onValueChange={onLevelChange}>
              <SelectTrigger id="sheet-courses-level" className="h-10 w-full">
                <SelectValue placeholder="Level" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>

                <SelectItem value="beginner">Beginner</SelectItem>

                <SelectItem value="intermediate">Intermediate</SelectItem>

                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Rating</FilterLabel>

            <Select value={rating} onValueChange={onRatingChange}>
              <SelectTrigger id="sheet-courses-rating" className="h-10 w-full">
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
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Purchased</FilterLabel>

            <Select value={purchased} onValueChange={onPurchasedChange}>
              <SelectTrigger
                id="sheet-courses-purchased"
                className="h-10 w-full">
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
          </FilterGroup>

          <FilterGroup>
            <div className="flex items-center justify-between">
              <FilterLabel>Price range</FilterLabel>

              <span className="text-xs text-muted-foreground">
                {price[0] === MIN_PRICE ? "$0" : `$${price[0]}`} -{" "}
                {price[1] === MAX_PRICE ? "No limit" : `$${price[1]}`}
              </span>
            </div>

            <Slider
              value={price}
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={PRICE_STEP}
              minStepsBetweenThumbs={1}
              onValueChange={(next) => {
                setPrice([next[0], next[1]]);
              }}
              onValueCommit={(next) => {
                onPriceChange(next[0], next[1]);
              }}
              aria-label="Price range"
            />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>${MIN_PRICE}</span>

              <span>${MAX_PRICE}+</span>
            </div>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Sort by</FilterLabel>

            <Select value={sort} onValueChange={onSortChange}>
              <SelectTrigger id="sheet-courses-sort" className="h-10 w-full">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Latest</SelectItem>

                <SelectItem value="price">Price: Low to High</SelectItem>

                <SelectItem value="-price">Price: High to Low</SelectItem>

                <SelectItem value="-ratings">Rating: High to Low</SelectItem>

                <SelectItem value="ratings">Rating: Low to High</SelectItem>

                <SelectItem value="-purchased">Most Purchased</SelectItem>

                <SelectItem value="purchased">Least Purchased</SelectItem>

                <SelectItem value="createdAt">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Results per page</FilterLabel>

            <Select value={limit} onValueChange={onLimitChange}>
              <SelectTrigger id="sheet-courses-limit" className="h-10 w-full">
                <SelectValue placeholder="Results per page" />
              </SelectTrigger>

              <SelectContent>
                {LIMIT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option} results
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterGroup>
        </div>

        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between gap-3">
            {activeCount > 0 ? (
              <Badge
                variant="secondary"
                className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10">
                {activeCount} active
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground">
                No filters applied
              </span>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              disabled={activeCount === 0}
              className="ml-auto">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset all filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

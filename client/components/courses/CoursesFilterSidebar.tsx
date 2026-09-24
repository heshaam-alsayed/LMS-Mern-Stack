"use client";

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

type Category = {
  _id: string;
  title: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  categories: Category[];

  category: string;
  price: string;
  estimatePrice: string;
  level: string;
  ratings: string;
  sort: string;
  limit: string;

  updateQuery: (key: string, value: string) => void;

  onReset: () => void;
};

export default function CourseFiltersSidebar({
  open,
  onOpenChange,

  categories,

  category,
  price,
  estimatePrice,
  level,
  ratings,
  sort,
  limit,

  updateQuery,

  onReset,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full max-w-[320px] overflow-y-auto sm:max-w-[380px]">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary/10">
              <SlidersHorizontal className="size-4 text-primary" />
            </span>
            Course Filters
          </SheetTitle>

          <SheetDescription className="text-xs leading-5">
            Filter and sort courses to find what you need.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6 pt-5">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Category
            </label>

            <Select
              value={category}
              onValueChange={(value) => updateQuery("category", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>

                {categories.map((item) => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Price</label>

            <Select
              value={price}
              onValueChange={(value) => updateQuery("price", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select price" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All prices</SelectItem>
                <SelectItem value="0">Free</SelectItem>
                <SelectItem value="100">Up to EGP 100</SelectItem>
                <SelectItem value="500">Up to EGP 500</SelectItem>
                <SelectItem value="1000">Up to EGP 1000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estimate Price */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Estimated Price
            </label>

            <Select
              value={estimatePrice}
              onValueChange={(value) => updateQuery("estimatePrice", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select estimated price" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All prices</SelectItem>
                <SelectItem value="100">Up to EGP 100</SelectItem>
                <SelectItem value="500">Up to EGP 500</SelectItem>
                <SelectItem value="1000">Up to EGP 1000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Level</label>

            <Select
              value={level}
              onValueChange={(value) => updateQuery("level", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ratings */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Rating
            </label>

            <Select
              value={ratings}
              onValueChange={(value) => updateQuery("ratings", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All ratings</SelectItem>
                <SelectItem value="5">5 stars</SelectItem>
                <SelectItem value="4">4 stars & above</SelectItem>
                <SelectItem value="3">3 stars & above</SelectItem>
                <SelectItem value="2">2 stars & above</SelectItem>
                <SelectItem value="1">1 star & above</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Sort By
            </label>

            <Select
              value={sort}
              onValueChange={(value) => updateQuery("sort", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sorting" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="createdAt">Newest</SelectItem>

                <SelectItem value="-createdAt">Oldest</SelectItem>

                <SelectItem value="price">Price: Low to High</SelectItem>

                <SelectItem value="-price">Price: High to Low</SelectItem>

                <SelectItem value="estimatePrice">
                  Estimated Price: Low to High
                </SelectItem>

                <SelectItem value="-estimatePrice">
                  Estimated Price: High to Low
                </SelectItem>

                <SelectItem value="ratings">Rating: Low to High</SelectItem>

                <SelectItem value="-ratings">Rating: High to Low</SelectItem>

                <SelectItem value="purchased">Most Purchased</SelectItem>

                <SelectItem value="-purchased">Least Purchased</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Limit */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Courses Per Page
            </label>

            <Select
              value={limit}
              onValueChange={(value) => updateQuery("limit", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Courses per page" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="6">6 courses</SelectItem>
                <SelectItem value="12">12 courses</SelectItem>
                <SelectItem value="24">24 courses</SelectItem>
                <SelectItem value="48">48 courses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset */}
          <div className="pt-1">
            <button
              type="button"
              onClick={onReset}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-md
                bg-muted
                px-4
                py-2.5
                text-sm
                font-medium
                text-foreground
                transition-colors
                hover:bg-muted/80
              ">
              <RotateCcw className="size-4" />
              Reset Filters
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

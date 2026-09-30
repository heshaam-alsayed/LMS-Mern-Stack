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

interface OrganizationOrdersFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  sort?: string;
  limit: string;

  priceMin: string;
  priceMax: string;

  activeCount: number;

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

export default function OrganizationOrdersFilterSheet({
  open,
  onOpenChange,
  sort,
  limit,
  priceMin,
  priceMax,
  activeCount,
  onSortChange,
  onLimitChange,
  onPriceChange,
  onReset,
}: OrganizationOrdersFilterSheetProps) {
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
            Narrow down the orders of your organization.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          <FilterGroup>
            <div className="flex items-center justify-between">
              <FilterLabel>Amount range</FilterLabel>

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
              aria-label="Amount range"
            />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>${MIN_PRICE}</span>

              <span>${MAX_PRICE}+</span>
            </div>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Sort by</FilterLabel>

            <Select value={sort} onValueChange={onSortChange}>
              <SelectTrigger id="sheet-orders-sort" className="h-10 w-full">
                <SelectValue placeholder="Latest" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="-createdAt">Latest</SelectItem>

                <SelectItem value="price">Amount: Low to High</SelectItem>

                <SelectItem value="-price">Amount: High to Low</SelectItem>

                <SelectItem value="createdAt">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Results per page</FilterLabel>

            <Select value={limit} onValueChange={onLimitChange}>
              <SelectTrigger id="sheet-orders-limit" className="h-10 w-full">
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

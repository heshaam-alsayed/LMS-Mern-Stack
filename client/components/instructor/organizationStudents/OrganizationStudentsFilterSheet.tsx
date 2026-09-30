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

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LIMIT_OPTIONS = [10, 20, 50, 100];

interface OrganizationStudentsFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  sort?: string;
  limit: string;

  activeCount: number;

  onSortChange: (value: string) => void;
  onLimitChange: (value: string) => void;
  onReset: () => void;
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-foreground">{children}</p>;
}

function FilterGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

export default function OrganizationStudentsFilterSheet({
  open,
  onOpenChange,
  sort,
  limit,
  activeCount,
  onSortChange,
  onLimitChange,
  onReset,
}: OrganizationStudentsFilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-[380px]">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Filters
          </SheetTitle>

          <SheetDescription className="text-xs leading-5">
            Narrow down the students of your organization.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          <FilterGroup>
            <FilterLabel>Sort by</FilterLabel>

            <Select value={sort} onValueChange={onSortChange}>
              <SelectTrigger id="sheet-students-sort" className="h-10 w-full">
                <SelectValue placeholder="Most Purchased" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="-purchasedCount">Most Purchased</SelectItem>

                <SelectItem value="purchasedCount">
                  Least Purchased
                </SelectItem>

                <SelectItem value="name">Name: A to Z</SelectItem>

                <SelectItem value="-name">Name: Z to A</SelectItem>

                <SelectItem value="-createdAt">Newest</SelectItem>

                <SelectItem value="createdAt">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Results per page</FilterLabel>

            <Select value={limit} onValueChange={onLimitChange}>
              <SelectTrigger id="sheet-students-limit" className="h-10 w-full">
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

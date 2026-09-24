"use client";

import { Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useDebounce } from "@/customHooks/useDebounce";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updateQuery: (key: string, value: string) => void;
};

export default function CourseSearchModal({
  open,
  onOpenChange,
  updateQuery,
}: Props) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  useEffect(() => {
    if (!debouncedSearch) return;
    updateQuery("search", debouncedSearch);
    onOpenChange(false);
  }, [debouncedSearch]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="size-5" />
            Search Courses
          </DialogTitle>

          <DialogDescription>
            Search for courses by name, category, or keyword.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="text-sm font-medium">Search</label>

          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search courses..."
              onChange={(e) => setSearch(e.target.value)}
              className="
                h-10
                w-full
                rounded-md
                border
                border-border
                bg-background
                pl-9
                pr-3
                text-sm
                text-foreground
                outline-none
                placeholder:text-muted-foreground
                focus:ring-2
                focus:ring-primary/20
              "
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Enter a course name or keyword to find what you need.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrganizationSelectFiltersProps {
  searchParams: URLSearchParams;
  updateQuery: (key: string, value: string) => void;
}

export default function OrganizationSelectFilters({
  searchParams,
  updateQuery,
}: OrganizationSelectFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      {/* ==================== STATUS ==================== */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Status</label>

        <Select
          value={searchParams.get("status") || "all"}
          onValueChange={(value) => updateQuery("status", value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>

            <SelectItem value="active">Active</SelectItem>

            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

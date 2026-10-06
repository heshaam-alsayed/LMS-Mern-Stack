"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  status: string;
  limit: string;
  onChange: (key: string, value: string) => void;
};

const LIMIT_OPTIONS = ["5", "10", "15", "20"];

export default function NotificationsFilters({
  status,
  limit,
  onChange,
}: Props) {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:flex-row sm:items-center">
      <div className="min-w-0 sm:w-[190px]">
        <label className="mb-2 block text-xs font-medium text-foreground">
          Status
        </label>

        <Select
          value={status}
          onValueChange={(value) => onChange("status", value)}>
          <SelectTrigger className="w-full" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>

            <SelectItem value="unread">Unread</SelectItem>

            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-0 sm:w-[130px]">
        <label className="mb-2 block text-xs font-medium text-foreground">
          Show
        </label>

        <Select
          value={limit}
          onValueChange={(value) => onChange("limit", value)}>
          <SelectTrigger className="w-full" aria-label="Rows per page">
            <SelectValue placeholder="Show" />
          </SelectTrigger>

          <SelectContent>
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

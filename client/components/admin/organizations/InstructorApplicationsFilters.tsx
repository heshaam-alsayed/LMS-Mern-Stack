import type { InstructorApplicationStatus } from "@/types/instructorApplication.type";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StatusFilter = "all" | InstructorApplicationStatus;

type Props = {
  status: StatusFilter;
  limit: number;
  onStatusChange: (status: StatusFilter) => void;
  onLimitChange: (limit: number) => void;
};

const statusOptions: {
  value: StatusFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All Applications",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
];

export default function InstructorApplicationsFilters({
  status,
  limit,
  onStatusChange,
  onLimitChange,
}: Props) {
  return (
    <section className="space-y-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold">Application Requests</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Review and manage submitted instructor applications.
          </p>
        </div>

        <Select
          value={String(limit)}
          onValueChange={(value) => onLimitChange(Number(value))}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Applications" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="6">6 per page</SelectItem>
            <SelectItem value="12">12 per page</SelectItem>
            <SelectItem value="24">24 per page</SelectItem>
            <SelectItem value="48">48 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-full items-center gap-2 overflow-x-auto border-t border-border/60 pt-4">
        {statusOptions.map((option) => {
          const isActive = status === option.value;

          return (
            <Button
              key={option.value}
              type="button"
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onStatusChange(option.value)}
              className="shrink-0">
              {option.label}
            </Button>
          );
        })}
      </div>
    </section>
  );
}

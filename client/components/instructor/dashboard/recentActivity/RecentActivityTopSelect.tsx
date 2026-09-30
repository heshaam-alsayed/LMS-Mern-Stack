"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TOP_OPTIONS = ["3", "5", "10", "20"];

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel: string;
};

export default function RecentActivityTopSelect({
  value,
  onValueChange,
  ariaLabel,
}: Props) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label={ariaLabel}
        className="h-8 w-[104px] shrink-0 text-xs">
        <SelectValue placeholder="Top" />
      </SelectTrigger>

      <SelectContent>
        {TOP_OPTIONS.map((option) => (
          <SelectItem key={option} value={option}>
            Top {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

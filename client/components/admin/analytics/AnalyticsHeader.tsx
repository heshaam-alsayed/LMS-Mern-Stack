"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  year: string;
  onYearChange: (year: string) => void;
  years: number[];
  header: string;
  title: string;
};

export default function AnalyticsHeader({
  year,
  onYearChange,
  years,
  header,
  title,
}: Props) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      {/* Content */}
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {header}
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {title}
        </p>
      </div>

      {/* Year Filter */}
      <div className="w-full sm:w-[140px]">
        <Select value={year} onValueChange={onYearChange}>
          <SelectTrigger
            className="
              h-10 w-full
              border-input
              bg-background
              text-foreground
              shadow-sm
              hover:bg-accent
              hover:text-accent-foreground
              focus:ring-0
              focus:ring-offset-0
            ">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>

          <SelectContent
            className="
              border-border
              bg-popover
              text-popover-foreground
            ">
            {years.map((item) => (
              <SelectItem
                key={item}
                value={item.toString()}
                className="
                  text-popover-foreground
                  focus:bg-accent
                  focus:text-accent-foreground
                ">
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

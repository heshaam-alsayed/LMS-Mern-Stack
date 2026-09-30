"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CourseStatusType } from "@/types/course.type";

const OPTIONS: { value: CourseStatusType; label: string; hint: string }[] = [
  {
    value: "draft",
    label: "Draft",
    hint: "Still being prepared, not visible to users.",
  },
  {
    value: "published",
    label: "Published",
    hint: "Live and available for purchase and enrollment.",
  },
  {
    value: "archived",
    label: "Archived",
    hint: "Stopped, hidden from users and closed to new purchases.",
  },
];

type Props = {
  value: CourseStatusType;
  onChange: (value: CourseStatusType) => void;
};

export default function CourseStatus({ value, onChange }: Props) {
  const active = OPTIONS.find((option) => option.value === value);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Course Status
      </label>

      <Select
        value={value || undefined}
        onValueChange={(next) => onChange(next as CourseStatusType)}>
        <SelectTrigger className="h-10 w-full">
          <SelectValue placeholder="Select course status" />
        </SelectTrigger>

        <SelectContent>
          {OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {active ? (
        <p className="text-xs text-muted-foreground">{active.hint}</p>
      ) : null}
    </div>
  );
}

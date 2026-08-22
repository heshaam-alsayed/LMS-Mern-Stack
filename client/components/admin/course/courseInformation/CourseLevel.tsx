"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CourseLevelType } from "@/types/course.type";

type Props = {
  value: CourseLevelType;
  onChange: (value: CourseLevelType) => void;
};

export default function CourseLevel({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Course Level
      </label>

      <Select
        value={value || undefined}
        onValueChange={(value) => {
          if (!value) return;

          onChange(value as CourseLevelType);
        }}>
        <SelectTrigger className="h-10 w-full">
          <SelectValue placeholder="Select course level" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="beginner">Beginner</SelectItem>
          <SelectItem value="intermediate">Intermediate</SelectItem>
          <SelectItem value="advanced">Advanced</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

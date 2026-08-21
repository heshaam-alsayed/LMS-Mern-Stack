"use client";

import { CourseInfo } from "@/types/course.type";

type Props = {
  value: CourseInfo["description"];
  onChange: (value: string) => void;
};

export default function CourseDescription({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="description"
        className="text-sm font-medium text-foreground">
        Course Description
      </label>

      <textarea
        id="description"
        name="description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe what students will learn from this course..."
        minLength={20}
        maxLength={300}
        required
        rows={4}
        className="min-h-20 max-h-30 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
      />

      <div className="text-right text-xs text-muted-foreground">
        {value.length}/30
      </div>
    </div>
  );
}

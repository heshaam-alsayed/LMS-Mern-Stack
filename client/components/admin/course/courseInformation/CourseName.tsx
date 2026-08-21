"use client";

import { CourseInfo } from "@/types/course.type";


type Props = {
  value: CourseInfo["name"];
  onChange: (value: string) => void;
};

export default function CourseName({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="name"
        className="text-sm font-medium text-foreground"
      >
        Course Name
      </label>

      <input
        id="name"
        name="name"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter course name"
        required
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
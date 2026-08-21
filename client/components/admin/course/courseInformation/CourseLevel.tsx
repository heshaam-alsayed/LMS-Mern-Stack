"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CourseLevel({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Course Level
      </label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 w-full">
          <SelectValue placeholder="Select course level" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="beginner">
            Beginner
          </SelectItem>

          <SelectItem value="intermediate">
            Intermediate
          </SelectItem>

          <SelectItem value="advanced">
            Advanced
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
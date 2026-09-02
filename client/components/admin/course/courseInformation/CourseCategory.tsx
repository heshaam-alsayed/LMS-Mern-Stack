"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICategory } from "@/types/category.type";

type Props = {
  value: string | null;
  onChange: (value: string) => void;
  options: ICategory[];
};
export default function CourseCategory({
  value,
  onChange,
  options = [],
}: Props) {
  console.log(value);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Course Category
      </label>

      <Select
        value={value || ""}
        onValueChange={(selectedValue) => {
          if (!selectedValue) return;

          onChange(selectedValue);
        }}>
        <SelectTrigger className="h-10 w-full">
          <SelectValue placeholder="Select course category" />
        </SelectTrigger>

        <SelectContent>
          {options?.map((item) => (
            <SelectItem key={item._id} value={item._id}>
              {item.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

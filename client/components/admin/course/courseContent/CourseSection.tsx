"use client";

import { Pencil } from "lucide-react";
import { CourseContentData } from "@/types/course.type";

type Props = {
  index: number;
  item: CourseContentData;
  setSectionInputRef: (index: number, element: HTMLInputElement | null) => void;
  handleSectionChange: (index: number, value: string) => void;
  handleEditSection: (index: number) => void;
};

export default function CourseSection({
  index,
  item,
  setSectionInputRef,
  handleSectionChange,
  handleEditSection,
}: Props) {
  return (
    <div className="flex w-full items-center gap-4 border px-3 py-2">
      {/* Section Name */}
      <div className="flex flex-1 items-center gap-2">
        <input
          ref={(element) => {
            setSectionInputRef(index, element);
          }}
          value={item.videoSection}
          onChange={(e) => handleSectionChange(index, e.target.value)}
          className="w-full bg-transparent text-2xl font-semibold outline-none"
          placeholder="Section name"
        />

        <button
          type="button"
          onClick={() => handleEditSection(index)}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground"
          title="Edit section">
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

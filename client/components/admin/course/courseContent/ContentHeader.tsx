"use client";

import React from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { CourseContentData } from "@/types/course.type";

type Props = {
  index: number;
  item: CourseContentData;
  isCollapsed: boolean;
  handleToggleCollapsed: (index: number) => void;
  handleDeleteContent: (index: number) => void;
};

export default function ContentHeader({
  index,
  item,
  isCollapsed,
  handleToggleCollapsed,
  handleDeleteContent,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4 border-x border-b px-3 py-2">
      {/* Content Title */}
      <div className="min-w-0 flex-1">
        {!isCollapsed && (
          <p className="truncate text-sm font-medium">
            {index + 1}. {item.title}
          </p>
        )}
      </div>

      {/* Content Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {/* Open / Close Content */}
        <button
          type="button"
          onClick={() => handleToggleCollapsed(index)}
          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground">
          {isCollapsed ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {/* Delete Content */}
        <button
          type="button"
          onClick={() => handleDeleteContent(index)}
          disabled={index === 0}
          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-30"
          title="Delete content">
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

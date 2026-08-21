"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { CourseContentData, CourseLink } from "@/types/course.type";

type Props = {
  index: number;
  link: CourseLink;
  linkIndex: number;
  courseContentData: CourseContentData[];
  setCourseContentData: (courseContentData: CourseContentData[]) => void;
  handleRemoveLink: (index: number, linkIndex: number) => void;
};

export default function ContentLink({
  index,
  link,
  linkIndex,
  courseContentData,
  setCourseContentData,
  handleRemoveLink,
}: Props) {
  const handleLinkTitleChange = (value: string) => {
    const updatedContentData = [...courseContentData];

    updatedContentData[index].links[linkIndex].title = value;

    setCourseContentData(updatedContentData);
  };

  const handleLinkUrlChange = (value: string) => {
    const updatedContentData = [...courseContentData];

    updatedContentData[index].links[linkIndex].url = value;

    setCourseContentData(updatedContentData);
  };

  return (
    <div className="group space-y-4 rounded-lg border bg-muted/20 p-4 transition-colors hover:bg-muted/30">
      {/* Link Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
            {linkIndex + 1}
          </div>

          <span className="text-sm font-medium">Link {linkIndex + 1}</span>
        </div>

        {linkIndex > 0 && (
          <button
            type="button"
            onClick={() => handleRemoveLink(index, linkIndex)}
            title="Remove link"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Link Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Link Title</label>

        <input
          type="text"
          value={link.title}
          onChange={(e) => handleLinkTitleChange(e.target.value)}
          placeholder="Enter link title"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Link URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Link URL</label>

        <input
          type="url"
          value={link.url}
          onChange={(e) => handleLinkUrlChange(e.target.value)}
          placeholder="https://example.com"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}

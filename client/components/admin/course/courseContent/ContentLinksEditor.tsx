"use client";

import React from "react";
import { Link2 } from "lucide-react";

import { CourseContentData, CourseLink } from "@/types/course.type";
import ContentLink from "./ContentLink";

type Props = {
  index: number;
  links: CourseLink[];
  courseContentData: CourseContentData[];
  setCourseContentData: (courseContentData: CourseContentData[]) => void;
  handleRemoveLink: (index: number, linkIndex: number) => void;
  handleAddLink: (index: number) => void;
};

export default function ContentLinksEditor({
  index,
  links,
  courseContentData,
  setCourseContentData,
  handleRemoveLink,
  handleAddLink,
}: Props) {
  return (
    <div className="space-y-3">
      {links.map((link: CourseLink, linkIndex: number) => (
        <ContentLink
          key={linkIndex}
          index={index}
          link={link}
          linkIndex={linkIndex}
          courseContentData={courseContentData}
          setCourseContentData={setCourseContentData}
          handleRemoveLink={handleRemoveLink}
        />
      ))}

      <button
        type="button"
        onClick={() => handleAddLink(index)}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary">
        <Link2 className="h-4 w-4" />
        Add Link
      </button>
    </div>
  );
}

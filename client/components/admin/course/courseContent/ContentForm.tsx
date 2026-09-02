"use client";

import React from "react";
import { Link2, PlusIcon } from "lucide-react";
import { CourseContentData, CourseLink } from "@/types/course.type";
import ContentLink from "./ContentLink";

type Props = {
  index: number;
  item: CourseContentData;
  courseContentData: CourseContentData[];
  setCourseContentData: (courseContentData: CourseContentData[]) => void;
  handleRemoveLink: (index: number, linkIndex: number) => void;
  handleAddLink: (index: number) => void;
  handleAddNewContent: (item: CourseContentData) => void;
};

export default function ContentForm({
  index,
  item,
  courseContentData,
  setCourseContentData,
  handleRemoveLink,
  handleAddLink,
  handleAddNewContent,
}: Props) {
  const handleChange = <K extends keyof CourseContentData>(
    field: K,
    value: CourseContentData[K],
  ) => {
    const updatedContentData = [...courseContentData];

    updatedContentData[index] = {
      ...updatedContentData[index],
      [field]: value,
    };

    setCourseContentData(updatedContentData);
  };

  return (
    <div className="space-y-4 border-x border-b px-3 py-4">
      {/* Content Title */}
      <div>
        <label className="mb-2 block text-sm font-medium">Video Title</label>

        <input
          type="text"
          value={item.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter content title"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Video URL */}
      <div>
        <label className="mb-2 block text-sm font-medium">Video URL</label>

        <input
          type="text"
          value={item.videoUrl}
          onChange={(e) => handleChange("videoUrl", e.target.value)}
          placeholder="Enter video URL"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Video Length */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Video Length (minutes)
        </label>

        <input
          type="number"
          min={0}
          value={item.videoLength ?? ""}
          onChange={(e) =>
            handleChange(
              "videoLength",
              e.target.value === "" ? "0" : e.target.value,
            )
          }
          placeholder="Enter video length"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium">Description</label>

        <textarea
          value={item.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter content description"
          className="min-h-24 max-h-48 w-full resize-y overflow-y-auto rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Links */}
      <div className="space-y-3">
        {item.links.map((link: CourseLink, linkIndex: number) => (
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

        {/* Add Link */}
        <button
          type="button"
          onClick={() => handleAddLink(index)}
          className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
          <Link2 className="h-4 w-4" />
          <span>Add Link</span>
        </button>
      </div>

      {/* Add New Content */}
      <button
        type="button"
        onClick={() => handleAddNewContent(item)}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
        <PlusIcon size={20} />
        Add new content
      </button>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Loader2, PlusIcon } from "lucide-react";

import { CourseContentData } from "@/types/course.type";
import { Checkbox } from "@/components/ui/checkbox";

import ContentLinksEditor from "./ContentLinksEditor";
import FormField, { controlClassName } from "./FormField";
import VideoUploader from "./VideoUploader";

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
  const [isResolvingLength, setIsResolvingLength] = useState(false);

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
    <div className="space-y-5 border-x border-b px-3 py-4">
      <FormField label="Video Title">
        <input
          type="text"
          value={item.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter content title"
          className={controlClassName}
        />
      </FormField>

      <FormField label="Video">
        <VideoUploader
          title={item.title}
          videoUrl={item.videoUrl ?? ""}
          onUploaded={(videoId) => handleChange("videoUrl", videoId)}
          onDurationResolved={(minutes) =>
            handleChange("videoLength", `${minutes}`)
          }
          onLengthResolvingChange={setIsResolvingLength}
        />
      </FormField>

      <FormField label="Video Length (minutes)">
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
          className={controlClassName}
        />

        {isResolvingLength ? (
          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Getting video length...
          </p>
        ) : null}
      </FormField>

      <div className="flex items-center gap-3">
        <Checkbox
          className="h-5 w-5 bg-background"
          id={`is-free-${index}`}
          checked={item.isFree}
          onCheckedChange={(checked) => handleChange("isFree", checked === true)}
        />

        <label
          htmlFor={`is-free-${index}`}
          className="cursor-pointer text-sm font-medium">
          Free Preview
        </label>
      </div>

      <FormField label="Description">
        <textarea
          value={item.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter content description"
          className={`${controlClassName} min-h-24 max-h-48 resize-y overflow-y-auto`}
        />
      </FormField>

      <ContentLinksEditor
        index={index}
        links={item.links}
        courseContentData={courseContentData}
        setCourseContentData={setCourseContentData}
        handleRemoveLink={handleRemoveLink}
        handleAddLink={handleAddLink}
      />

      <button
        type="button"
        onClick={() => handleAddNewContent(item)}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary">
        <PlusIcon className="h-5 w-5" />
        Add new content
      </button>
    </div>
  );
}

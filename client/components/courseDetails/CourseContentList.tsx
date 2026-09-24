"use client";

import {
  formatDuration,
  getTotalDuration,
  getTotalDurationSection,
} from "@/lib/utils";
import { CourseContentData } from "@/types/course.type";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  Dot,
  PlayCircle,
} from "lucide-react";
import React, { useState } from "react";
import PreviewModal from "../modal/PreviewModal";

type Props = {
  data: CourseContentData[] | undefined;
  handleVideoChange?: (index: number) => void;
  activeVideo?: number;
  isPurchased?: boolean | undefined;
  isContentCourse?: boolean;
  completedLectures?: string[];
};

export default function CourseContentList({
  data = [],
  handleVideoChange,
  isPurchased,
  activeVideo,
  isContentCourse,
  completedLectures,
}: Props) {
  const [collapsedAll, setCollapsedAll] = useState(true);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [previewLecture, setPreviewLecture] =
    useState<CourseContentData | null>(null);
  const [openPreview, setOpenPreview] = useState(false);

  const sections = [...new Set(data.map((item) => item.videoSection))];

  const getSectionContent = (section: string) => {
    return data.filter((item) => item.videoSection === section);
  };

  const toggleSection = (section: string) => {
    if (visibleSections.includes(section)) {
      setVisibleSections((prev) => prev.filter((item) => item !== section));
    } else {
      setVisibleSections((prev) => [...prev, section]);
    }
  };

  const toggleAllSections = () => {
    if (collapsedAll) {
      setVisibleSections(sections);
    } else {
      setVisibleSections([]);
    }

    setCollapsedAll(!collapsedAll);
  };

  const handleClicPreview = (contentLecture: CourseContentData) => {
    setOpenPreview(true);
    setPreviewLecture(contentLecture);
  };

  const isLectureCompleted = (lectureId: string) => {
    return (completedLectures ?? []).some(
      (completedLectureId) =>
        completedLectureId.toString() === lectureId.toString(),
    );
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      {!isPurchased && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Course content
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore all sections and lectures included in this course.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {sections.length}
              </span>{" "}
              sections
              <span className="mx-2 text-border">·</span>
              <span className="font-medium text-foreground">
                {data.length}
              </span>{" "}
              {data.length === 1 ? "lecture" : "lectures"}
              <span className="mx-2 text-border">·</span>
              {getTotalDuration(data)} total length
            </p>

            <button
              type="button"
              onClick={toggleAllSections}
              className="w-fit text-sm font-semibold text-primary transition-colors hover:text-primary/80">
              {collapsedAll ? "Expand all sections" : "Collapse all sections"}
            </button>
          </div>
        </div>
      )}

      {/* Content Course Controls */}
      {isContentCourse && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={toggleAllSections}
            className="rounded-md px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10">
            {collapsedAll ? "Expand all" : "Collapse all"}
          </button>
        </div>
      )}

      {/* Sections */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {sections.map((section, sectionIndex) => {
          const isOpen = visibleSections.includes(section);
          const sectionContent = getSectionContent(section);

          return (
            <div
              key={sectionIndex}
              className="border-b border-border last:border-b-0">
              {/* Section Header */}
              <button
                type="button"
                onClick={() => toggleSection(section)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-muted/40 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {isOpen ? (
                      <ChevronUp className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
                      {section}
                    </h3>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {sectionContent.length}{" "}
                      {sectionContent.length === 1 ? "lecture" : "lectures"}
                    </p>
                  </div>
                </div>

                <div className="hidden shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground sm:flex sm:text-sm">
                  <span>{sectionContent.length}</span>
                  <Dot className="size-3" />
                  <span>{getTotalDurationSection(sectionContent)}</span>
                </div>
              </button>

              {/* Lectures */}
              {isOpen && (
                <div className="border-t border-border bg-muted/20">
                  {sectionContent.map((lecture, lectureIndex) => {
                    const activeVideoIndex = data.indexOf(lecture);
                    const isActive = activeVideoIndex === activeVideo;

                    const isCompleted = isLectureCompleted(
                      lecture?._id?.toString(),
                    );

                    return (
                      <div
                        key={lectureIndex}
                        onClick={() => {
                          handleVideoChange?.(activeVideoIndex);
                        }}
                        className={`group relative flex items-center gap-3 border-l-2 px-4 py-3.5 transition-all hover:cursor-pointer sm:px-5 ${
                          isActive
                            ? "border-l-primary bg-primary/[0.07]"
                            : "border-l-transparent hover:bg-muted/40"
                        }`}>
                        {/* Lecture Icon */}
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                            isCompleted
                              ? "bg-emerald-500/15"
                              : isActive
                                ? "bg-primary/15"
                                : "bg-muted"
                          }`}>
                          {isCompleted ? (
                            <Check
                              className="size-4 text-emerald-500"
                              strokeWidth={2.5}
                            />
                          ) : isActive ? (
                            <PlayCircle className="size-[18px] text-primary" />
                          ) : (
                            <Circle className="size-3.5 text-muted-foreground" />
                          )}
                        </div>

                        {/* Lecture Information */}
                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 items-center gap-2">
                            <p
                              className={`min-w-0 truncate text-sm font-medium transition-colors ${
                                isActive ? "text-primary" : "text-foreground"
                              }`}>
                              {lecture.title}
                            </p>
                          </div>

                          {/* Completed Badge */}
                          {isCompleted && (
                            <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-green-800 px-2 py-1 text-[10px] font-semibold  text-green-100 ">
                              <span className="flex size-3.5 items-center justify-center rounded-full bg-green-500">
                                <Check
                                  className="size-2.5 text-white"
                                  strokeWidth={3}
                                />
                              </span>
                              Completed
                            </span>
                          )}
                        </div>

                        {/* Preview */}
                        {lecture.isFree && !isContentCourse && (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleClicPreview(lecture);
                            }}
                            className="hidden shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary sm:flex">
                            <PlayCircle className="size-3.5" />
                            Preview
                          </button>
                        )}

                        {/* Duration */}
                        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                          {formatDuration(Number(lecture.videoLength))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      <PreviewModal
        onOpenChange={setOpenPreview}
        open={openPreview}
        previewLecture={previewLecture}
      />
    </section>
  );
}

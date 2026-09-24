"use client";

import { CourseContentData } from "@/types/course.type";
import {
  BookOpen,
  Clock3,
  Lightbulb,
  PlayCircle,
  Sparkles,
} from "lucide-react";

type Props = {
  currentLesson: CourseContentData;
};

export default function OverviewTab({ currentLesson }: Props) {
  const { description, isFree, videoLength, videoSection, suggestion } =
    currentLesson;
  return (
    <div className="space-y-8 py-6">
      {/* Lesson Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
            <PlayCircle className="size-4 text-primary" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Lesson
          </span>

          {isFree && (
            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
              <Sparkles className="size-3" />
              Free Preview
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BookOpen className="size-4 text-primary" />
          About this lesson
        </h3>

        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
      </section>

      {/* Lesson Information */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Lesson Information
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Section */}
          <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-4 py-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background">
              <BookOpen className="size-4 text-primary" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Section</p>

              <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                {videoSection}
              </p>
            </div>
          </div>

          {/* Duration */}
          {videoLength !== undefined && (
            <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-4 py-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background">
                <Clock3 className="size-4 text-primary" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Duration</p>

                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {videoLength} minutes
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Suggestion */}
      {suggestion && (
        <section>
          <div className="rounded-lg border bg-muted/40 p-5">
            <div className="flex gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Lightbulb className="size-4 text-primary" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground">
                  Instructor&apos;s Note
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {suggestion}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

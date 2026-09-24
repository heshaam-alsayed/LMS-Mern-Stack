"use client";

import { CheckCircle2, CirclePlay, GraduationCap } from "lucide-react";

interface Props {
  percentage: number;
  completedCount: number;
  totalLectures: number;
}

export default function ProgressCourseContent({
  percentage,
  completedCount,
  totalLectures,
}: Props) {
  const isCompleted = percentage === 100;

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              {isCompleted ? (
                <CheckCircle2 className="size-5 text-primary" />
              ) : (
                <GraduationCap className="size-5 text-primary" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {isCompleted ? "Course Completed" : "Your Course Progress"}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {completedCount} of {totalLectures} lectures completed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CirclePlay className="size-4 text-muted-foreground" />

            <span className="text-sm font-semibold text-foreground">
              {percentage}%
            </span>

            <span className="text-xs text-muted-foreground">complete</span>
          </div>
        </div>

        <div className="mt-5">
          <div
            className="h-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Course progress">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

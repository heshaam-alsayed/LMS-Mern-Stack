"use client";
import React from "react";

export default function CoursePlayerSkeleton() {
  return (
    <div className="relative aspect-video w-full max-w-[900px] overflow-hidden rounded-xl bg-muted/40">
      <div className="absolute inset-0 animate-pulse">
        <div className="h-full w-full bg-muted/60" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />

          <div className="space-y-2 text-center">
            <div className="mx-auto h-3 w-28 animate-pulse rounded bg-muted" />

            <div className="mx-auto h-2.5 w-20 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

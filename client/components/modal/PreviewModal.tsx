"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourseContentData } from "@/types/course.type";
import CoursePlayer from "../admin/course/coursePlayer/CoursePlayer";
import { PlayCircle, Sparkles } from "lucide-react";

type PreviewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewLecture: CourseContentData | null;
};

export default function PreviewModal({
  open,
  onOpenChange,
  previewLecture,
}: PreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] !max-w-6xl overflow-hidden p-0 sm:w-[50vw]">
        {/* Header */}
        <DialogHeader className="border-b border-border  px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PlayCircle className="size-6" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase  text-primary">
                  Preview
                </span>

                {previewLecture?.isFree && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    <Sparkles className="size-3" />
                    Free Preview
                  </span>
                )}
              </div>

              <DialogTitle className="truncate text-lg font-semibold text-foreground">
                {previewLecture?.title}
              </DialogTitle>

              <p className="text-sm text-muted-foreground">
                Watch a preview of this lesson before enrolling in the course.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Video */}
        <div className=" p-4 sm:px-6 sm:py-2">
          <div className="overflow-hidden rounded-xl">
            <CoursePlayer
              title={previewLecture?.title}
              videoUrl={previewLecture?.videoUrl}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

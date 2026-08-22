"use client";

import { useModalBehavior } from "@/customHooks/useModalBehavior";
import { CourseData } from "@/types/course.type";
import { Check, Loader2, X } from "lucide-react";

type Props = {
  open: boolean;
  courseData: CourseData | null;
  isCreating?: boolean;
  isUpdating?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isEdit: boolean;
};

export default function ConfirmCourseModal({
  open,
  courseData,
  isCreating = false,
  isUpdating = false,
  onClose,
  onConfirm,
  isEdit,
}: Props) {
  const price = courseData?.price ?? 0;

  const isSubmitting = isCreating || isUpdating;

  useModalBehavior({
    isOpen: open,
    onClose,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="
          absolute inset-0
          bg-foreground/25
          backdrop-blur-sm
          dark:bg-background/70
        "
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className="
          relative z-10
          w-full max-w-[520px]
          overflow-hidden
          rounded-2xl
          border border-border/60
          bg-background
          shadow-xl
          dark:shadow-black/50
        ">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6">
          <div className="pr-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {isEdit
                ? "Ready to update your course?"
                : "Ready to create your course?"}
            </h2>

            <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
              {isEdit
                ? "Review the information below before updating your course."
                : "Review the information below before creating your course."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="
              rounded-lg
              p-1.5
              text-muted-foreground
              transition-all
              duration-200
              hover:bg-muted
              hover:text-foreground
              active:scale-95
              disabled:pointer-events-none
              disabled:opacity-50
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
            ">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Course */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Course
            </p>

            <p className="mt-1.5 text-sm font-semibold leading-6 text-foreground">
              {courseData?.name || "Untitled course"}
            </p>
          </div>

          {/* Level / Price */}
          <div className="mt-5 grid grid-cols-2 gap-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Level
              </p>

              <p className="mt-1.5 text-sm font-semibold capitalize text-foreground">
                {courseData?.level || "—"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Price
              </p>

              <p className="mt-1.5 text-sm font-semibold text-foreground">
                {price === 0 ? "Free" : `$${price}`}
              </p>
            </div>
          </div>

          {/* Confirmation */}
          <div
            className="
              mt-6
              flex items-start gap-3
              rounded-xl
              border border-primary/15
              bg-primary/5
              p-4
              dark:bg-primary/10
            ">
            <div
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-full
                bg-primary/10
                text-primary
                dark:bg-primary/15
              ">
              <Check className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">
                {isEdit ? "Ready to update" : "Ready to create"}
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {isEdit
                  ? "Your changes are ready. You can continue managing the course after it has been updated."
                  : "Your course information looks good. You can continue managing the course after it has been created."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            flex items-center justify-between
            border-t border-border/60
            bg-muted/20
            px-6 py-4
          ">
          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
              rounded-lg
              px-4 py-2.5
              text-sm font-medium
              text-muted-foreground
              transition-all duration-200
              hover:bg-muted
              hover:text-foreground
              active:scale-[0.98]
              disabled:pointer-events-none
              disabled:opacity-50
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
            ">
            Cancel
          </button>

          {/* Create / Update */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="
              group
              inline-flex
              min-w-[145px]
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-primary
              px-5 py-2.5
              text-sm font-semibold
              text-primary-foreground
              shadow-sm
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-primary/90
              hover:shadow-md
              active:translate-y-0
              active:scale-[0.98]
              disabled:pointer-events-none
              disabled:opacity-70
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
              focus-visible:ring-offset-2
              focus-visible:ring-offset-background
            ">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Check className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                {isEdit ? "Update Course" : "Create Course"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

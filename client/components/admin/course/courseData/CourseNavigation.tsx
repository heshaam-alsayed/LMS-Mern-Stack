"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  active: number;
  onPrevious: () => void;
  onNext: () => void;
};

export default function CourseNavigation({
  active,
  onPrevious,
  onNext,
}: Props) {
  return (
    <div className="flex items-center justify-between border-t pt-6 mt-4">
      <button
        type="button"
        onClick={onPrevious}
        disabled={active === 0}
        className="inline-flex items-center gap-2 rounded-md border px-5 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40">
        <ArrowLeft className="h-4 w-4" />
        Previous
      </button>

      <button
        type="button"
        onClick={onNext}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">
        Next
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

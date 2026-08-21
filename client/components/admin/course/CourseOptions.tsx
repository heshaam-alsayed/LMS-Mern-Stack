"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  active: number;
  setActive: (active: number) => void;
};

const options = [
  "Course Information",
  "Course Options",
  "Course Content",
  "Course Preview",
];

export default function CourseOptions({ active, setActive }: Props) {
  const progress =
    options.length > 1 ? (active / (options.length - 1)) * 100 : 0;

  const handleStepClick = (index: number) => {
    if (index > active) return;

    setActive(index);
  };

  return (
    <div className="w-full">
      <div className="relative">
        {/* Progress Track */}
        <div className="absolute bottom-4 left-4 top-4 w-px bg-border">
          {/* Active Progress */}
          <div
            className="w-full bg-primary transition-all duration-300"
            style={{ height: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex flex-col justify-between gap-6">
          {options.map((option, index) => {
            const isActive = index === active;
            const isCompleted = index < active;

            return (
              <button
                key={option}
                type="button"
                disabled={index > active}
                onClick={() => handleStepClick(index)}
                className={cn(
                  "flex items-center gap-3 text-left",
                  "focus-visible:outline-none",
                  index > active && "cursor-not-allowed",
                )}>
                {/* Circle */}
                <span
                  className={cn(
                    "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    "border bg-background text-xs font-semibold",
                    "transition-all duration-200",

                    (isActive || isCompleted) &&
                      "border-primary bg-primary text-primary-foreground",

                    !isActive &&
                      !isCompleted &&
                      "border-border text-muted-foreground",
                  )}>
                  {isCompleted ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    index + 1
                  )}
                </span>

                {/* Label */}
                <span
                  className={cn(
                    "text-sm font-medium",
                    (isActive || isCompleted) && "text-foreground",
                    !isActive && !isCompleted && "text-muted-foreground",
                  )}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

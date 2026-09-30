"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, indicatorClassName, ...props }, ref) => {
    const safeValue = Math.min(Math.max(value || 0, 0), 100);

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-muted",
          className,
        )}
        {...props}>
        <div
          className={cn(
            "h-full w-full flex-1 rounded-full transition-all duration-500 ease-out",
            indicatorClassName || "bg-primary",
          )}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    );
  },
);

Progress.displayName = "Progress";

export { Progress };

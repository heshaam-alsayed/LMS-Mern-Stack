import { Check } from "lucide-react";

interface EnrolledCourseProgressProps {
  percentage: number;
  completedCount: number;
  totalLectures: number;
}

export default function EnrolledCourseProgress({
  percentage,
  completedCount,
  totalLectures,
}: EnrolledCourseProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Course Progress
        </span>

        <span className="text-sm font-semibold text-foreground">
          {percentage}%
        </span>
      </div>

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}>
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {completedCount} of {totalLectures} lectures completed
        </span>

        {percentage === 100 && (
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
    </div>
  );
}

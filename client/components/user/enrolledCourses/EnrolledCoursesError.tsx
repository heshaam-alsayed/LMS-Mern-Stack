import { AlertCircle, RefreshCcw } from "lucide-react";

interface EnrolledCoursesErrorProps {
  message?: string;
  onRetry: () => void;
}

export default function EnrolledCoursesError({
  message = "Something went wrong while loading your courses.",
  onRetry,
}: EnrolledCoursesErrorProps) {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-destructive/30 bg-card px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>

        <h2 className="text-xl font-semibold text-foreground">
          Unable to load courses
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <RefreshCcw className="h-4 w-4" />

          Try Again
        </button>
      </div>
    </div>
  );
}
import { AlertCircle, RotateCcw } from "lucide-react";

type Props = {
  error: string;
  onRetry: () => void;
  onReset: () => void;
};

export default function CoursesErrorState({
  error,
  onRetry,
  onReset,
}: Props) {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-7 text-destructive" />
        </div>

        <h2 className="text-lg font-semibold text-foreground">
          Something went wrong
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          We couldn&apos;t load the courses right now. Please try again
          or reset your filters.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-muted px-4 py-3 text-left">
            <p className="break-words text-xs text-muted-foreground">
              {error}
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="
              inline-flex
              h-9
              items-center
              gap-2
              rounded-md
              bg-primary
              px-4
              text-sm
              font-medium
              text-primary-foreground
              transition-colors
              hover:bg-primary/90
            "
          >
            <RotateCcw className="size-4" />
            Try again
          </button>

          <button
            type="button"
            onClick={onReset}
            className="
              inline-flex
              h-9
              items-center
              gap-2
              rounded-md
              border
              border-border
              bg-background
              px-4
              text-sm
              font-medium
              text-foreground
              transition-colors
              hover:bg-muted
            "
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
import { AlertCircle, RefreshCw } from "lucide-react";
import React from "react";

type Props = {
  error: string;
  refetch: () => void;
};
export default function ErrorState({ error, refetch }: Props) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-7" />
        </div>

        <div className="mt-5 space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            Unable to load layouts
          </h2>

          <p className="text-sm leading-relaxed text-muted-foreground">
            We couldn&apos;t load your layouts right now. Please try again in a
            moment.
          </p>

          <div className="mt-4 rounded-lg border border-border bg-muted/50 px-4 py-3 text-left">
            <p className="break-words text-xs text-muted-foreground">{error}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={refetch}
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
          <RefreshCw className="size-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}

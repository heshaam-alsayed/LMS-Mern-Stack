"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

type Props = {
  message?: string;
  onRetry: () => void;
};

export default function InvoicesError({ message, onRetry }: Props) {
  return (
    <div className="flex min-h-[420px] w-full items-center justify-center rounded-xl border border-border bg-card p-6">
      <div className="flex max-w-md flex-col items-center text-center">
        {/* Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-7 w-7" />
        </div>

        {/* Title */}
        <h2 className="mt-5 text-base font-semibold text-foreground">
          Unable to load invoices
        </h2>

        {/* Description */}
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          We couldn&apos;t retrieve the invoices right now. Please check your
          connection and try again.
        </p>

        {/* Error message */}
        {message && (
          <div className="mt-4 w-full rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
            <p className="break-words text-xs text-destructive">{message}</p>
          </div>
        )}

        {/* Retry */}
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}

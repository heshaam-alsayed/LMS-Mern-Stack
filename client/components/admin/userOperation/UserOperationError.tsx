"use client";

import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserOperationErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function UserOperationError({
  message = "We couldn't load this user's information. Please try again.",
  onRetry,
}: UserOperationErrorProps) {
  const router = useRouter();

  return (
    <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-card p-6">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative flex w-full max-w-md flex-col items-center text-center">
        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted/50 text-muted-foreground shadow-sm">
          <AlertCircle className="h-8 w-8" />
        </div>

        {/* Content */}
        <div className="mt-5">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Unable to Load User
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30">
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </button>
          )}

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Error Indicator */}
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          User details are currently unavailable
        </div>
      </div>
    </section>
  );
}

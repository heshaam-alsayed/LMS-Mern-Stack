"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

type CertificateErrorStateProps = {
  message: string;

  onRetry: () => void;

  isRetrying?: boolean;
};

export function CertificateErrorState({
  message,
  onRetry,
  isRetrying = false,
}: CertificateErrorStateProps) {
  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto flex min-h-[70vh] max-w-[1440px] items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10 text-destructive">
            <AlertTriangle className="size-7" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Verification Failed
            </span>

            <span className="size-1 rounded-full bg-muted-foreground/40" />

            <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-[11px] font-medium text-destructive">
              <span className="size-1.5 rounded-full bg-destructive" />
              Unable to Load
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            We could not load your certificate
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {message ||
              "This certificate could not be verified. It may have been revoked, or the link may be incomplete."}
          </p>

          <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              className="h-11 gap-2"
              onClick={onRetry}
              disabled={isRetrying}>
              <RotateCcw
                className={`size-4 ${isRetrying ? "animate-spin" : ""}`}
              />

              {isRetrying ? "Retrying..." : "Try Again"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CertificateErrorState;
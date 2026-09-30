"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type AnalyticsErrorProps = {
  message: string;
  onRetry: () => void;
};

export default function AnalyticsError({
  message,
  onRetry,
}: AnalyticsErrorProps) {
  return (
    <div className="rounded-2xl border border-border bg-background">
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Something went wrong
          </h2>

          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            {message}
          </p>
        </div>

        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </div>
  );
}

"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CourseOperationErrorProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export default function CourseOperationError({
  onRetry,
  isRetrying = false,
}: CourseOperationErrorProps) {
  return (
    <Card className="border-border/60 bg-card shadow-sm">
      <CardContent className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10">
          <AlertCircle className="h-5 w-5 text-destructive" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Failed to load course operation
        </h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          We couldn&apos;t load the course performance data. Please try again.
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-5 gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
          />

          {isRetrying ? "Retrying..." : "Try again"}
        </Button>
      </CardContent>
    </Card>
  );
}
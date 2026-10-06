"use client";

import { BellOff, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  message?: string;
  onRetry: () => void;
};

export default function NotificationsErrorState({ message, onRetry }: Props) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-border bg-background px-4 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <BellOff className="h-7 w-7" />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-foreground">
        Failed to load notifications
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {message || "Something went wrong while loading notifications."}
      </p>

      <Button
        type="button"
        variant="outline"
        onClick={onRetry}
        className="mt-6">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}

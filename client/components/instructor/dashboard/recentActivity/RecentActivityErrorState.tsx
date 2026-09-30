"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  message?: string;
  onRetry: () => void;
};

export default function RecentActivityErrorState({
  title,
  message,
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
        <AlertCircle className="h-5 w-5 text-destructive" />
      </div>

      <p className="text-sm font-medium text-foreground">{title}</p>

      {message ? (
        <p className="max-w-xs text-xs leading-5 text-muted-foreground">
          {message}
        </p>
      ) : null}

      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

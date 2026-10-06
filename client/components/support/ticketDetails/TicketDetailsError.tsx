"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  message: string;
  onRetry: () => void;
};

export default function TicketDetailsError({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </div>

      <div>
        <h1 className="text-lg font-semibold">Could not load this ticket</h1>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2" onClick={onRetry}>
          <RotateCcw className="size-4" />

          Try again
        </Button>

        <Button variant="ghost" asChild>
          <Link href="/support/create-ticket">Create a new ticket</Link>
        </Button>
      </div>
    </div>
  );
}
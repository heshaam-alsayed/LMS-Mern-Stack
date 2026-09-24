import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  error: Error | null;
  onRetry: () => void;
  isFetching: boolean;
};

export default function InstructorApplicationsError({
  error,
  onRetry,
  isFetching,
}: Props) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
          <RefreshCw className="size-7 text-muted-foreground" />
        </div>

        <div className="mt-5 max-w-md space-y-2">
          <h3 className="text-lg font-semibold">Something went wrong</h3>

          <p className="text-sm leading-6 text-muted-foreground">
            We couldn&apos;t load the instructor applications. Please try again.
          </p>
        </div>

        {error?.message && (
          <p className="mt-3 max-w-md break-words text-xs text-muted-foreground">
            {error.message}
          </p>
        )}

        <Button onClick={onRetry} disabled={isFetching} className="mt-6 gap-2">
          <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />

          {isFetching ? "Retrying..." : "Try Again"}
        </Button>
      </CardContent>
    </Card>
  );
}

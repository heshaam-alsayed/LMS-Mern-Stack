import { Building2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  onRefresh: () => void;
  isFetching: boolean;
};

export default function InstructorApplicationsHeader({
  onRefresh,
  isFetching,
}: Props) {
  return (
    <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Building2 className="size-4" />
          Instructor Management
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Instructor Applications
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review instructor applications and manage their approval status.
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={isFetching}
        className="w-full gap-2 sm:w-auto">
        <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />

        {isFetching ? "Refreshing..." : "Refresh"}
      </Button>
    </section>
  );
}

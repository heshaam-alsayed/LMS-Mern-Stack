import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  onRefresh: () => void;
  isFetching: boolean;
};

export default function InstructorApplicationHeader({
  onRefresh,
  isFetching,
}: Props) {
  return (
    <section className=" gap-5">
      <div className="min-w-0 space-y-3">
        <div className="flex items-center justify-between w-full">
          <Button asChild variant="ghost" size="sm" className="gap-2 px-0">
            <Link href="/admin/instructor-applications">
              <ArrowLeft className="size-4" />
              Back to Applications
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isFetching}
            className="shrink-0 gap-2">
            <RefreshCw
              className={`size-4 ${isFetching ? "animate-spin" : ""}`}
            />

            {isFetching ? "Refreshing..." : "Refresh Application"}
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Instructor Application
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review the applicant information, organization details, and
            application status before taking action.
          </p>
        </div>
      </div>
    </section>
  );
}

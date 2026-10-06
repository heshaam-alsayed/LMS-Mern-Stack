"use client";

import { useSectionInView } from "@/hooks/useSectionInView";

import RecentEnrollmentsPanel from "./RecentEnrollmentsPanel";
import RecentReviewsPanel from "./RecentReviewsPanel";

export default function InstructorRecentActivity() {
  const { ref, hasEnteredView } = useSectionInView<HTMLElement>("50px 0px");

  return (
    <section ref={ref} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Recent activity
        </h2>

        <p className="mt-0.5 text-sm text-muted-foreground">
          The latest students who enrolled, and what they said about your
          courses.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentEnrollmentsPanel enabled={hasEnteredView} />
        <RecentReviewsPanel enabled={hasEnteredView} />
      </div>
    </section>
  );
}

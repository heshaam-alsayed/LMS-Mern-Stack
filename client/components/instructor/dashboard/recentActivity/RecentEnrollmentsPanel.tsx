"use client";

import { useState } from "react";
import { Users } from "lucide-react";

import useMyOrganizationRecentEnrollments from "@/customHooks/useMyOrganizationRecentEnrollments";

import RecentActivityPanel from "./RecentActivityPanel";
import RecentEnrollmentRow from "./RecentEnrollmentRow";

const DEFAULT_TOP = "5";

export default function RecentEnrollmentsPanel() {
  const [top, setTop] = useState(DEFAULT_TOP);

  const { enrollments, isLoading, isError, error, refetch } =
    useMyOrganizationRecentEnrollments(Number(top));

  return (
    <RecentActivityPanel
      icon={Users}
      title="Recent enrollments"
      description="Students who bought your courses"
      count={enrollments.length}
      isEmpty={enrollments.length === 0}
      emptyMessage="Once a student buys one of your courses, they show up here."
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      top={top}
      onTopChange={setTop}>
      <div className="divide-y divide-border">
        {enrollments.map((enrollment) => (
          <RecentEnrollmentRow
            key={enrollment._id}
            enrollment={enrollment}
          />
        ))}
      </div>
    </RecentActivityPanel>
  );
}

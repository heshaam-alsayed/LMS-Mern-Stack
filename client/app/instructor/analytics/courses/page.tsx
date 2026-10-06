import { Suspense } from "react";

import OrganizationCoursesAnalytics from "@/components/instructor/analytics/OrganizationCoursesAnalytics";
import CoursesAnalyticsSkeleton from "@/components/skeleton/CoursesAnalyticsSkeleton";

export default function page() {
  // reads the year query param through useStatisticsYear
  return (
    <Suspense fallback={<CoursesAnalyticsSkeleton />}>
      <OrganizationCoursesAnalytics />
    </Suspense>
  );
}
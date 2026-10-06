import { Suspense } from "react";

import CoursesAnalytics from "@/components/admin/analytics/courses/CoursesAnalytics";
import CoursesAnalyticsSkeleton from "@/components/skeleton/CoursesAnalyticsSkeleton";

export default function page() {
  return (
    <Suspense fallback={<CoursesAnalyticsSkeleton />}>
      <CoursesAnalytics />
    </Suspense>
  );
}
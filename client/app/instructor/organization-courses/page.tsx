import { Suspense } from "react";

import OrganizationCourses from "@/components/instructor/organizationCourses/OrganizationCourses";
import OrganizationCoursesPageSkeleton from "@/components/skeleton/OrganizationCoursesPageSkeleton";

export default function page() {
  // the list its filters and the sidebar all read the
  return (
    <Suspense fallback={<OrganizationCoursesPageSkeleton />}>
      <OrganizationCourses />
    </Suspense>
  );
}
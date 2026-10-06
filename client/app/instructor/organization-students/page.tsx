import { Suspense } from "react";

import OrganizationStudents from "@/components/instructor/organizationStudents/OrganizationStudents";
import OrganizationStudentsPageSkeleton from "@/components/skeleton/OrganizationStudentsPageSkeleton";

export default function page() {
  // the list and its filters read the query string
  return (
    <Suspense fallback={<OrganizationStudentsPageSkeleton />}>
      <OrganizationStudents />
    </Suspense>
  );
}
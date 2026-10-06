import { Suspense } from "react";

import AllOrganizations from "@/components/admin/allOrganizations/AllOrganizations";
import OrganizationsTableSkeleton from "@/components/skeleton/OrganizationsTableSkeleton";

export default function page() {
  // AllOrganizations reads the filter query string search page sort status
  return (
    <Suspense fallback={<OrganizationsTableSkeleton />}>
      <AllOrganizations />
    </Suspense>
  );
}
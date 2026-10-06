import { Suspense } from "react";

import OrganizationOrders from "@/components/instructor/organizationOrders/OrganizationOrders";
import OrganizationOrdersPageSkeleton from "@/components/skeleton/OrganizationOrdersPageSkeleton";

export default function page() {
  // the list and its filters read the query string
  return (
    <Suspense fallback={<OrganizationOrdersPageSkeleton />}>
      <OrganizationOrders />
    </Suspense>
  );
}
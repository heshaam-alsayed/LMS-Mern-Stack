import { Suspense } from "react";

import OrganizationApplicationContent from "@/components/organization/application/OrganizationApplicationContent";
import ApplicationStatusSkeleton from "@/components/skeleton/ApplicationStatusSkeleton";

export default function page() {
  // OrganizationApplicationContent reads status from the query string
  return (
    <Suspense fallback={<ApplicationStatusSkeleton />}>
      <OrganizationApplicationContent />
    </Suspense>
  );
}
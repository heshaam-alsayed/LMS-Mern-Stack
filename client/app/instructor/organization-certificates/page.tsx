import { Suspense } from "react";

import OrganizationCertificates from "@/components/instructor/organizationCertificates/OrganizationCertificates";
import OrganizationCertificatesPageSkeleton from "@/components/skeleton/OrganizationCertificatesPageSkeleton";

export default function page() {
  return (
    <Suspense fallback={<OrganizationCertificatesPageSkeleton />}>
      <OrganizationCertificates />
    </Suspense>
  );
}
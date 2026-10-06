import { Suspense } from "react";

import AdminCertifications from "@/components/admin/certifications/AdminCertifications";
import OrganizationCertificatesPageSkeleton from "@/components/skeleton/OrganizationCertificatesPageSkeleton";

export default function CertificationsPage() {
  return (
    <Suspense fallback={<OrganizationCertificatesPageSkeleton />}>
      <AdminCertifications />
    </Suspense>
  );
}
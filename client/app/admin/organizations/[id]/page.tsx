import { Suspense } from "react";

import OrganizationDetails from "@/components/admin/organizationDetails/OrganizationDetails";
import OrganizationDetailsSkeleton from "@/components/skeleton/OrganizationDetailsSkeleton";

type Params = {
  id: string;
};

export default async function page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  // OrganizationDetails reads the analytics tab query string
  return (
    <Suspense fallback={<OrganizationDetailsSkeleton />}>
      <OrganizationDetails id={id} />
    </Suspense>
  );
}
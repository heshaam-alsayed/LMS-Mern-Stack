import { Suspense } from "react";

import OrganizationOrdersAnalytics from "@/components/admin/organizationDetails/ordersAnalytics/OrganizationOrdersAnalytics";
import OrdersAnalyticsSkeleton from "@/components/skeleton/OrdersAnalyticsSkeleton";

type Params = {
  id: string;
};

export default async function page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  // reads the year query param through useStatisticsYear
  return (
    <Suspense fallback={<OrdersAnalyticsSkeleton />}>
      <OrganizationOrdersAnalytics id={id} />
    </Suspense>
  );
}
import { Suspense } from "react";

import OrganizationOrdersAnalytics from "@/components/instructor/analytics/OrganizationOrdersAnalytics";
import OrdersAnalyticsSkeleton from "@/components/skeleton/OrdersAnalyticsSkeleton";

export default function page() {
  // reads the year query param through useStatisticsYear
  return (
    <Suspense fallback={<OrdersAnalyticsSkeleton />}>
      <OrganizationOrdersAnalytics />
    </Suspense>
  );
}
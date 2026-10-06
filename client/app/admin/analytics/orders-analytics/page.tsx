import { Suspense } from "react";

import OrdersAnalytics from "@/components/admin/analytics/orders/OrdersAnalytics";
import OrdersAnalyticsSkeleton from "@/components/skeleton/OrdersAnalyticsSkeleton";

export default function page() {
  // OrdersAnalytics reads the year query param through useStatisticsYear
  return (
    <Suspense fallback={<OrdersAnalyticsSkeleton />}>
      <OrdersAnalytics />
    </Suspense>
  );
}
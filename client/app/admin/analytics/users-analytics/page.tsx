import { Suspense } from "react";

import UsersAnalytics from "@/components/admin/analytics/users/UsersAnalytics";
import UsersAnalyticsSkeleton from "@/components/skeleton/UsersAnalyticsSekelton";

export default function page() {
  // UsersAnalytics reads the year query param through useStatisticsYear
  return (
    <Suspense fallback={<UsersAnalyticsSkeleton />}>
      <UsersAnalytics />
    </Suspense>
  );
}
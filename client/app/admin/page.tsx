import { Suspense } from "react";

import Dashboard from "@/components/admin/dashboard/Dashboard";
import DashboardSkeleton from "@/components/skeleton/DashboardSkeleton";

export default function page() {
  // the dashboard year switcher reads year through useStatisticsYear
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
"use client";

import AnalyticsHeader from "../AnalyticsHeader";
import useStatisticsYear from "@/customHooks/useStatisticsYear";

import OrdersStatistics from "./OrdersStatistics";
import { OrdersChartMonthly } from "./OrdersChartAnalytics";

import OrdersAnalyticsSkeleton from "@/components/skeleton/OrdersAnalyticsSkeleton";
import useOrdersAnalytics from "@/customHooks/useuseOrdersAnalytics";

export default function OrdersAnalytics() {
  const { currentYear, handleYearChange, years } = useStatisticsYear();

  const { isLoading, monthly, statistics } = useOrdersAnalytics({
    year: currentYear,
  });

  if (isLoading) {
    return <OrdersAnalyticsSkeleton />;
  }

  if (!statistics || !monthly) {
    return null;
  }

  return (
    <div className="space-y-8">
      <AnalyticsHeader
        year={currentYear}
        onYearChange={handleYearChange}
        years={years}
        header="Orders Analytics"
        title="Monitor order activity, track sales performance, and analyze revenue growth over time."
      />

      <OrdersStatistics
        totalOrders={statistics.data.totalOrders}
        newOrders={statistics.data.newOrders}
        totalRevenue={statistics.data.totalRevenue}
        yearlyRevenue={statistics.data.yearlyRevenue}
      />

      <OrdersChartMonthly year={currentYear} chartData={monthly.data} />
    </div>
  );
}

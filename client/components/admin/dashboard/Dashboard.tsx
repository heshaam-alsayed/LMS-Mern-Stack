"use client";

import useStatisticsYear from "@/customHooks/useStatisticsYear";
import { getOrdersRevenueMonthly } from "@/lib/api/ordersRevenueMonthly";
import { getGrothAnalytics } from "@/lib/api/getGrothAnalytics";
import { useQuery } from "@tanstack/react-query";

import GrowthAnalyticsCards from "./GrowthAnalyticsCards";
import { OrdersRevenueChart } from "./OrdersRevenueChart";
import { getTopSellingCourses } from "@/lib/api/getTopSellingCourses";
import TopSellingCourses from "./TopSellingCourses";
import { useState } from "react";
import { getAllOrdersInvoices } from "@/lib/api/getOrders";
import RecentTransactions from "./RecentTransactions";

export default function Dashboard() {
  const { currentYear, years, handleYearChange } = useStatisticsYear();
  const [topCoursesLimit, setTopCoursesLimit] = useState(10);

  const { 
    data:revenueData,
    isLoading: isLoadingRevenue,
    isError: isErrorRevenue,
    error: revenueError,
  } = useQuery({
    queryKey: ["revenue-orders", currentYear],
    queryFn: () => getOrdersRevenueMonthly(currentYear),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: growthData,
    isLoading: isLoadingGrowth,
    isError: isErrorGrowth,
    error: growthError,
  } = useQuery({
    queryKey: ["analytics-growth"],
    queryFn: () => getGrothAnalytics(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: topCoursesData,
    isLoading: isLoadingTopCourses,
    isError: isErrorTopCourses,
    error: topCoursesError,
  } = useQuery({
    queryKey: ["top-courses-selling", topCoursesLimit],
    queryFn: () => getTopSellingCourses(topCoursesLimit.toString()),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: transactionData,
    isLoading: isLoadingTransaction,
    isError: isErrorTransaction,
    error: transactionError,
  } = useQuery({
    queryKey: ["transaction-orders"],
    queryFn: () => getAllOrdersInvoices(true),
    staleTime: 5 * 60 * 1000,
  });
  
 
  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="min-w-0 w-full lg:w-[70%]">
          <OrdersRevenueChart
            monthlyData={revenueData?.data.monthly}
            yearlyRevenue={revenueData?.data.yearlyRevenue}
            allTimeRevenue={revenueData?.data.allTimeRevenue}
            year={currentYear}
            years={years}
            handleYearChange={handleYearChange}
            isError={isErrorRevenue}
            isLoading={isLoadingRevenue}
            error={revenueError?.message ?? null}
          />
        </div>

        <div className="flex w-full lg:w-[30%]">
          <GrowthAnalyticsCards
            users={growthData?.data?.users}
            courses={growthData?.data?.courses}
            orders={growthData?.data?.orders}
            isLoading={isLoadingGrowth}
            isError={isErrorGrowth}
            error={growthError?.message ?? null}
          />
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col gap-4 lg:flex-row ">
        <div className="flex min-w-0 w-full lg:w-[60%]">
          <TopSellingCourses
            courses={topCoursesData?.courses ?? []}
            isLoading={isLoadingTopCourses}
            isError={isErrorTopCourses}
            error={topCoursesError?.message ?? null}
            limit={topCoursesLimit}
            onLimitChange={setTopCoursesLimit}
          />
        </div>

        <div className="flex w-full lg:w-[40%]">
          <RecentTransactions
            orders={transactionData?.orders ?? []}
            isLoading={isLoadingTransaction}
            isError={isErrorTransaction}
            error={transactionError?.message ?? null}
          />
        </div>
      </div>
    </div>
  );
}

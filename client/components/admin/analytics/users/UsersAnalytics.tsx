"use client";

import AnalyticsHeader from "../AnalyticsHeader";
import useStatisticsYear from "@/customHooks/useStatisticsYear";
import useUsersAnalytics from "@/customHooks/useUsersAnalytics";

import UsersStatistics from "./UsersStatistics";
import { UsersChartAnalytics } from "./UsersChartAnalytics";

import UsersAnalyticsSkeleton from "@/components/skeleton/UsersAnalyticsSekelton";

export default function UsersAnalytics() {
  const { currentYear, handleYearChange, years } = useStatisticsYear();

  const { isLoading, monthly, statistics } = useUsersAnalytics({
    year: currentYear,
  });

  if (isLoading) {
    return <UsersAnalyticsSkeleton />;
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
        header="Users Analytics"
        title="Track user growth, registrations, and account activity throughout the year."
      />

      <UsersStatistics
        totalUsers={statistics.data.totalUsers}
        newUsers={statistics.data.newUsers}
        usersWithCourses={statistics.data.usersWithCourses}
        deletedUsers={statistics.data.deletedUsers}
      />

      <UsersChartAnalytics year={currentYear} chartData={monthly.data} />
    </div>
  );
}

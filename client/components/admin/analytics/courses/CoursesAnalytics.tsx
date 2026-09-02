"use client";

import AnalyticsHeader from "../AnalyticsHeader";
import useStatisticsYear from "@/customHooks/useStatisticsYear";
import useCoursesAnalytics from "@/customHooks/useCoursesAnalytics";

import CoursesStatistics from "./CoursesStatistics";
import { CoursesChartMonthly } from "./CoursesChartMonthly";

import CoursesAnalyticsSkeleton from "@/components/skeleton/CoursesAnalyticsSkeleton";

export default function CoursesAnalytics() {
  const { currentYear, handleYearChange, years } = useStatisticsYear();

  const { isLoading, monthly, statistics } = useCoursesAnalytics({
    year: currentYear,
  });

  if (isLoading) {
    return <CoursesAnalyticsSkeleton />;
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
        header="Courses Analytics"
        title="Monitor your course creation activity and track how your course catalog grows over time."
      />

      <CoursesStatistics
        averageRating={statistics.data.averageRating}
        coursesCreated={statistics.data.coursesCreated}
        totalCourses={statistics.data.totalCourses}
        totalPurchases={statistics.data.totalPurchases}
      />

      <CoursesChartMonthly chartData={monthly.data} year={currentYear} />
    </div>
  );
}

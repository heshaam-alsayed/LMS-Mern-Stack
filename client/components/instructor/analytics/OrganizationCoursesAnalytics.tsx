"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import AnalyticsHeader from "@/components/admin/analytics/AnalyticsHeader";
import useStatisticsYear from "@/customHooks/useStatisticsYear";
import useMyOrganizationCoursesAnalytics from "@/customHooks/useMyOrganizationCoursesAnalytics";

import CoursesStatistics from "@/components/admin/analytics/courses/CoursesStatistics";
import { CoursesChartMonthly } from "@/components/admin/analytics/courses/CoursesChartMonthly";

import CoursesAnalyticsSkeleton from "@/components/skeleton/CoursesAnalyticsSkeleton";

import AnalyticsError from "./AnalyticsError";

export default function OrganizationCoursesAnalytics() {
  const { currentYear, handleYearChange, years } = useStatisticsYear();

  const { statistics, monthly, isLoading, isError, error, refetch } =
    useMyOrganizationCoursesAnalytics({ year: currentYear });

  if (isLoading) {
    return <CoursesAnalyticsSkeleton />;
  }

  if (isError) {
    return (
      <AnalyticsError
        message={
          error?.message || "Error loading your organization courses analytics."
        }
        onRetry={refetch}
      />
    );
  }

  if (!statistics) return null;

  return (
    <div className="space-y-6">
      <Link
        href="/instructor/organization-courses"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />

        Back to my courses
      </Link>

      <AnalyticsHeader
        year={currentYear}
        onYearChange={handleYearChange}
        years={years}
        header="Courses Analytics"
        title="Course creation activity and how your organization course catalog grows over time."
      />

      <CoursesStatistics
        averageRating={statistics.averageRating}
        coursesCreated={statistics.coursesCreated}
        totalCourses={statistics.totalCourses}
        totalPurchases={statistics.totalPurchases}
      />

      <CoursesChartMonthly chartData={monthly} year={currentYear} />
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import AnalyticsHeader from "@/components/admin/analytics/AnalyticsHeader";
import useStatisticsYear from "@/customHooks/useStatisticsYear";
import useOrganizationCoursesAnalytics from "@/customHooks/useOrganizationCoursesAnalytics";

import CoursesStatistics from "@/components/admin/analytics/courses/CoursesStatistics";
import { CoursesChartMonthly } from "@/components/admin/analytics/courses/CoursesChartMonthly";

import CoursesAnalyticsSkeleton from "@/components/skeleton/CoursesAnalyticsSkeleton";

import OrganizationDetailsError from "@/components/admin/organizationDetails/OrganizationDetailsError";

type Props = {
  id: string;
};

export default function OrganizationCoursesAnalytics({ id }: Props) {
  const { currentYear, handleYearChange, years } = useStatisticsYear();

  const { statistics, monthly, isLoading, isError, error, refetch } =
    useOrganizationCoursesAnalytics({
      id,
      year: currentYear,
    });

  if (isLoading) {
    return <CoursesAnalyticsSkeleton />;
  }

  if (isError) {
    return (
      <OrganizationDetailsError
        message={
          error?.message ||
          "Error loading organization courses analytics."
        }
        onRetry={refetch}
      />
    );
  }

  if (!statistics) return null;

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/organizations/${id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />

        Back to organization
      </Link>

      <AnalyticsHeader
        year={currentYear}
        onYearChange={handleYearChange}
        years={years}
        header="Courses Analytics"
        title="Course creation activity and how this organization's course catalog grows over time."
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

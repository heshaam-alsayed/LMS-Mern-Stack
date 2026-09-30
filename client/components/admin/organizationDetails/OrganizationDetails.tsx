"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Building2 } from "lucide-react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { getOrganizationDetails } from "@/lib/api/getOrganizationDetails";

import { PaginationData } from "@/components/shared/Pagination";

import OrganizationDetailsError from "./OrganizationDetailsError";
import OrganizationDetailsSkeleton from "@/components/skeleton/OrganizationDetailsSkeleton";
import OrganizationInfo from "./OrganizationInfo";
import OrganizationCoursesFilter from "./OrganizationCoursesFilter";
import OrganizationCoursesTable from "./OrganizationCoursesTable";

const initialPagination: PaginationData = {
  currentPage: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

type Props = {
  id: string;
};

export default function OrganizationDetails({ id }: Props) {
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["organization-details", id, queryString],
    queryFn: () => getOrganizationDetails(id, queryString),
    // Keep the previous page of data while a new filter set is loading, so the
    // page itself (header + organization info) never falls back to the skeleton.
    placeholderData: keepPreviousData,
  });

  // First load only. Once data exists, filter changes keep the page rendered
  // and only the courses table shows its own loading state.
  if (isLoading) {
    return <OrganizationDetailsSkeleton />;
  }

  if (isError && !data) {
    return (
      <OrganizationDetailsError
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  if (!data) return null;

  const { organization, courses, pagination } = data;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/organizations"
            aria-label="Back to organizations"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-foreground">
              {organization.name}
            </h1>

            <p className="text-sm text-muted-foreground">
              Organization details
            </p>
          </div>
        </div>

        <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {pagination.total} courses
        </span>
      </div>

      <OrganizationInfo
        organization={organization}
        totalCourses={pagination.total}
      />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />

          <h2 className="text-base font-semibold text-foreground">
            Organization Courses
          </h2>
        </div>

        <OrganizationCoursesFilter
          pagination={pagination ?? initialPagination}
        />

        <OrganizationCoursesTable
          courses={courses ?? []}
          isLoading={isFetching}
          error={isError ? (error as Error) : null}
        />
      </div>
    </div>
  );
}

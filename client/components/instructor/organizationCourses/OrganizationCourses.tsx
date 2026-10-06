"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Building2, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";

import { getMyOrganization } from "@/lib/api/getMyOrganization";
import { getOrganizationCourses } from "@/lib/api/getOrganizationCourses";
import { updateCourseStatus } from "@/lib/api/updateCourseStatus";

import { CourseStatusType } from "@/types/course.type";
import { GetOrganizationCoursesResponse } from "@/types/organization.type";

import OrganizationCoursesFilter from "./OrganizationCoursesFilter";
import OrganizationCoursesTable from "./OrganizationCoursesTable";

import OrganizationCoursesPageSkeleton from "@/components/skeleton/OrganizationCoursesPageSkeleton";
import Pagination, { PaginationData } from "@/components/shared/Pagination";

const INITIAL_PAGINATION: PaginationData = {
  currentPage: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export default function OrganizationCourses() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryClient = useQueryClient();

  const queryString = searchParams.toString();

  const {
    data: organizationResponse,
    isLoading: isLoadingOrganization,
    isError: isOrganizationError,
    error: organizationError,
    refetch: refetchOrganization,
  } = useQuery({
    queryKey: ["my-organization"],
    queryFn: getMyOrganization,
    staleTime: 5 * 60 * 1000,
  });

  const organization = organizationResponse?.organization ?? null;

  const {
    data,
    isLoading: isLoadingCourses,
    isFetching: isFetchingCourses,
    error: coursesError,
  } = useQuery({
    queryKey: ["organization-courses", organization?._id, queryString],
    queryFn: () => getOrganizationCourses(organization!._id, queryString),
    enabled: Boolean(organization),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  const changeStatusMutation = useMutation({
    mutationFn: ({
      courseId,
      status,
    }: {
      courseId: string;
      status: CourseStatusType;
    }) => updateCourseStatus(courseId, status),

    onSuccess: (response) => {
      queryClient.setQueriesData<GetOrganizationCoursesResponse>(
        { queryKey: ["organization-courses", organization?._id] },
        (prev) =>
          prev
            ? {
                ...prev,
                courses: prev.courses.map((course) =>
                  course._id === response.course._id
                    ? { ...course, status: response.course.status }
                    : course,
                ),
              }
            : prev,
      );

      toast.success("Course status updated");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const goToPage = (page: number) => {
    const params = new URLSearchParams(queryString);

    params.set("page", String(page));

    router.push(`${pathname}?${params.toString()}`);
  };

  const isInitialLoading = isLoadingOrganization || isLoadingCourses;

  if (isInitialLoading) {
    return <OrganizationCoursesPageSkeleton />;
  }

  if (isOrganizationError || !organization) {
    const isMissing =
      organizationError?.message ===
      "No organization is linked to this account";

    return (
      <div className="rounded-2xl border border-border bg-background">
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            {isMissing ? (
              <Building2 className="h-6 w-6 text-muted-foreground" />
            ) : (
              <AlertCircle className="h-6 w-6 text-destructive" />
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {isMissing ? "No organization linked" : "Something went wrong"}
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              {organizationError?.message ??
                "We could not load your organization right now."}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              refetchOrganization();
            }}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const pagination = data?.pagination ?? INITIAL_PAGINATION;
  const isSuspended = organization.status === "suspended";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-background p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                My Courses
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  {organization.name}
                </h1>

                <Badge
                  variant="secondary"
                  className={
                    isSuspended
                      ? "rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 hover:bg-amber-500/10 dark:text-amber-400"
                      : "rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                  }>
                  {organization.status}
                </Badge>
              </div>

              {organization.description ? (
                <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
                  {organization.description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl flex items-center gap-3 border border-border bg-muted/30 px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">
                Total Courses
              </p>

              <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                {pagination.total}
              </p>
            </div>

            <div className="rounded-xl flex items-center gap-3 border border-border bg-muted/30 px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">
                Courses on This Page
              </p>

              <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                {data?.result ?? 0}
              </p>
            </div>
            <Button asChild>
              <Link href="/instructor/create-course">
                <PlusCircle className="mr-2 h-4 w-4" />
                New course
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {pagination.total > 0 ? <OrganizationCoursesFilter /> : null}

      <div className="w-full overflow-hidden rounded-xl border bg-background shadow-sm">
        <OrganizationCoursesTable
          courses={data?.courses ?? []}
          isLoading={isFetchingCourses && !data?.courses?.length}
          error={coursesError}
          onStatusChange={(courseId, status) =>
            changeStatusMutation.mutate({ courseId, status })
          }
          changingCourseId={changeStatusMutation.isPending
            ? (changeStatusMutation.variables?.courseId ?? null)
            : null}
        />

        {pagination.total > 0 ? (
          <Pagination
            pagination={pagination}
            itemLabel="courses"
            onNext={() => goToPage(pagination.currentPage + 1)}
            onPrevious={() => goToPage(pagination.currentPage - 1)}
          />
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { AlertCircle, Award } from "lucide-react";

import { Button } from "@/components/ui/button";

import OrganizationCertificatesStats from "@/components/instructor/organizationCertificates/OrganizationCertificatesStats";
import OrganizationCertificatesFilter from "@/components/instructor/organizationCertificates/OrganizationCertificatesFilter";
import OrganizationCertificateCard from "@/components/instructor/organizationCertificates/OrganizationCertificateCard";

import { OrganizationCertificatesGridSkeleton } from "@/components/skeleton/OrganizationCertificatesPageSkeleton";
import Pagination, { PaginationData } from "@/components/shared/Pagination";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getAllCertificates } from "@/lib/api/getAllCertificates";

const INITIAL_PAGINATION: PaginationData = {
  currentPage: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const EMPTY_STATS = {
  totalCertificates: 0,
  totalStudents: 0,
  totalCourses: 0,
  totalLearningHours: 0,
};

function CertificationsPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-background p-6">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-muted" />

          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-6 w-56 animate-pulse rounded bg-muted" />
            <div className="h-3 w-72 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-background px-4 py-3">
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            <div className="mt-2.5 h-7 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="h-10 w-full animate-pulse rounded-md bg-muted sm:w-[340px]" />
        <div className="h-10 w-full animate-pulse rounded-md bg-muted sm:w-28" />
      </div>

      <OrganizationCertificatesGridSkeleton />
    </div>
  );
}

export default function AdminCertifications() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-certificates", queryString],
    queryFn: () => getAllCertificates(queryString),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  const goToPage = (page: number) => {
    const params = new URLSearchParams(queryString);

    params.set("page", String(page));

    router.push(`${pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return <CertificationsPageSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-border bg-background">
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Something went wrong
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              {error?.message ??
                "We could not load the certificates right now."}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              refetch();
            }}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const { certificates, stats } = data;
  const pagination = data.pagination ?? INITIAL_PAGINATION;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-background p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Certificates
              </p>

              <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                All Certifications
              </h1>

              <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
                Every certificate issued across all organizations on the
                platform.
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {pagination.total.toLocaleString()} total
          </span>
        </div>
      </div>

      <OrganizationCertificatesStats stats={stats ?? EMPTY_STATS} />

      {pagination.total > 0 ? <OrganizationCertificatesFilter /> : null}

      {certificates && certificates.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <OrganizationCertificateCard
              key={certificate._id}
              certificate={certificate}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-background">
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
              <Award className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="font-medium text-foreground">No certificates found</p>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try adjusting your filters, or wait until a student completes a
              course.
            </p>
          </div>
        </div>
      )}

      {pagination.total > 0 ? (
        <div className="rounded-xl border border-border bg-background">
          <Pagination
            pagination={pagination}
            itemLabel="certificates"
            onNext={() => goToPage(pagination.currentPage + 1)}
            onPrevious={() => goToPage(pagination.currentPage - 1)}
          />
        </div>
      ) : null}
    </div>
  );
}
"use client";

import { Award, Building2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { GetOrganizationCertificatesResponse } from "@/types/certificate.type";

import OrganizationCertificatesFilter from "./OrganizationCertificatesFilter";
import OrganizationCertificatesStats from "./OrganizationCertificatesStats";
import OrganizationCertificateCard from "./OrganizationCertificateCard";

import OrganizationCertificatesPageSkeleton from "@/components/skeleton/OrganizationCertificatesPageSkeleton";
import Pagination, { PaginationData } from "@/components/shared/Pagination";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getOrganizationCertificates } from "@/lib/api/getOrganizationCertificates";

const NO_ORGANIZATION_ERROR = "No organization is linked to this account";

const INITIAL_PAGINATION: PaginationData = {
  currentPage: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export default function OrganizationCertificates() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] =
    useState<GetOrganizationCertificatesResponse | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const getCertificatesMutation = useMutation({
    mutationFn: (queryString: string) =>
      getOrganizationCertificates(queryString),

    onSuccess: (response) => {
      setData(response);
      setHasFetched(true);
    },

    onError: () => {
      setHasFetched(true);
    },
  });

  useEffect(() => {
    getCertificatesMutation.mutate(searchParams.toString());
  }, [searchParams]);

  const refetch = () => {
    getCertificatesMutation.mutate(searchParams.toString());
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));

    router.push(`${pathname}?${params.toString()}`);
  };

  const error = getCertificatesMutation.error;

  if (!hasFetched) {
    return <OrganizationCertificatesPageSkeleton />;
  }

  if (error || !data) {
    const isMissing = error?.message === NO_ORGANIZATION_ERROR;

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
              {error?.message ??
                "We could not load your certificates right now."}
            </p>
          </div>

          <Button variant="outline" onClick={refetch}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const { organization, certificates, stats } = data;
  const pagination = data.pagination ?? INITIAL_PAGINATION;
  const isSuspended = organization.status === "suspended";

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
        </div>
      </div>

      <OrganizationCertificatesStats stats={stats} />

      <OrganizationCertificatesFilter />

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
              Try adjusting your filters, or wait until a student completes one
              of your courses.
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

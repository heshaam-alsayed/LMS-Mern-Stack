"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getInstructorApplications } from "@/lib/api/getInstructorApplications";
import type { InstructorApplicationStatus } from "@/types/instructorApplication.type";

import InstructorApplicationsHeader from "./InstructorApplicationsHeader";
import InstructorApplicationsStats from "./InstructorApplicationsStats";
import InstructorApplicationsFilters from "./InstructorApplicationsFilters";
import InstructorApplicationCardSkeleton from "@/components/skeleton/InstructorApplicationCardSkeleton";
import InstructorApplicationsError from "./InstructorApplicationsError";
import InstructorApplicationsEmpty from "./InstructorApplicationsEmpty";
import InstructorApplicationCard from "./InstructorApplicationCard";
import InstructorApplicationsPagination from "./InstructorApplicationsPagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type StatusFilter = "all" | InstructorApplicationStatus;

const DEFAULT_LIMIT = 6;

const VALID_LIMITS = [6, 12, 24, 48];

const isValidStatus = (value: string | null): value is StatusFilter => {
  return (
    value === "all" ||
    value === "pending" ||
    value === "approved" ||
    value === "rejected"
  );
};

const getValidPage = (value: string | null) => {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
};

const getValidLimit = (value: string | null) => {
  const limit = Number(value);

  return VALID_LIMITS.includes(limit) ? limit : DEFAULT_LIMIT;
};

export default function InstructorApplications() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialPage = getValidPage(searchParams.get("page"));
  const initialLimit = getValidLimit(searchParams.get("limit"));

  const initialStatusParam = searchParams.get("status");

  const initialStatus: StatusFilter = isValidStatus(initialStatusParam)
    ? initialStatusParam
    : "all";

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [status, setStatus] = useState<StatusFilter>(initialStatus);

  const updateUrl = (
    nextPage: number,
    nextLimit: number,
    nextStatus: StatusFilter,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(nextPage));
    params.set("limit", String(nextLimit));

    if (nextStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", nextStatus);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (status !== "all") {
      params.set("status", status);
    }

    return params.toString();
  }, [page, limit, status]);

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["instructor-applications", page, limit, status],
    queryFn: () => getInstructorApplications(queryString),
    placeholderData: (previousData) => previousData,
  });

  const applications = data?.applications || [];
  const pagination = data?.pagination;

  const handleStatusChange = (value: StatusFilter) => {
    setStatus(value);
    setPage(1);

    updateUrl(1, limit, value);
  };

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
    updateUrl(1, value, status);
  };

  const handlePreviousPage = () => {
    if (!pagination?.hasPreviousPage) return;

    const nextPage = page - 1;

    setPage(nextPage);

    updateUrl(nextPage, limit, status);
  };

  const handleNextPage = () => {
    if (!pagination?.hasNextPage) return;

    const nextPage = page + 1;

    setPage(nextPage);

    updateUrl(nextPage, limit, status);
  };

  const showPagination =
    !isPending && !isError && pagination && pagination.totalPages > 0;

  return (
    <main className="space-y-6 p-4 ">
      <InstructorApplicationsHeader
        onRefresh={refetch}
        isFetching={isFetching}
      />

      <InstructorApplicationsStats
        applications={applications}
        totalApplications={pagination ? pagination.totalApplications : 0}
      />

      <InstructorApplicationsFilters
        status={status}
        limit={limit}
        onStatusChange={handleStatusChange}
        onLimitChange={handleLimitChange}
      />

      {isPending && (
        <section className="grid grid-cols-1 gap-5  md:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: limit }).map((_, index) => (
            <InstructorApplicationCardSkeleton key={index} />
          ))}
        </section>
      )}

      {isError && (
        <InstructorApplicationsError
          error={error}
          onRetry={refetch}
          isFetching={isFetching}
        />
      )}

      {!isPending && !isError && applications.length === 0 && (
        <InstructorApplicationsEmpty />
      )}

      {!isPending && !isError && applications.length > 0 && (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {applications.map((application) => (
            <InstructorApplicationCard
              key={application._id}
              application={application}
            />
          ))}
        </section>
      )}

      {showPagination && (
        <InstructorApplicationsPagination
          pagination={pagination}
          isFetching={isFetching}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
        />
      )}
    </main>
  );
}

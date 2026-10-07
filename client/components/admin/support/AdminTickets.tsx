"use client";

import { AlertTriangle, LifeBuoy, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminTickets } from "@/hooks/support/useAdminTickets";
import {
  useTicketListUrlParams,
  type TicketStatusFilter,
} from "@/hooks/support/useTicketListUrlParams";
import { useAppSelector } from "@/redux/hooks";

import AdminTicketCard, { AdminTicketsEmpty } from "./AdminTicketCard";

const FILTERS: { value: TicketStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "closed", label: "Closed" },
];

const LIMIT = 9;

export default function AdminTickets() {
  const { user } = useAppSelector((state) => state.auth);

  const { status, page, setFilter, setPage } = useTicketListUrlParams();

  const { data, isPending, isError, error, refetch } = useAdminTickets({
    page,
    limit: LIMIT,
    status,
  });

  const tickets = data?.tickets ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const isEmpty = (data?.allTotal ?? 0) === 0;

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </div>

        <div>
          <p className="text-lg font-semibold">Could not load tickets</p>

          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading tickets."}
          </p>
        </div>

        <Button variant="outline" className="gap-2" onClick={() => refetch()}>
          <RotateCcw className="size-4" />

          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LifeBuoy className="size-4" />
          </div>

          <div>
            <h1 className="text-lg font-semibold">Support Tickets</h1>

            <p className="text-xs text-muted-foreground">
              {total} ticket{total === 1 ? "" : "s"} total
            </p>
          </div>
        </div>

        {!isEmpty ? (
          <div className="flex items-center gap-1 rounded-xl border bg-card p-1">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setFilter(filter.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  status === filter.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}>
                {filter.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {tickets.length === 0 ? (
        <AdminTicketsEmpty />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tickets.map((ticket) => (
              <AdminTicketCard
                key={ticket._id}
                ticket={ticket}
                currentAdminId={user?._id}
              />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(Math.max(1, page - 1))}>
                Previous
              </Button>

              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
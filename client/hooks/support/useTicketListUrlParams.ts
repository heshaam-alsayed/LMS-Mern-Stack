"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { TicketStatus } from "@/types/ticket.type";

export type TicketStatusFilter = "all" | TicketStatus;

export const isTicketStatusFilter = (
  value: string | null,
): value is TicketStatusFilter =>
  value === "all" ||
  value === "open" ||
  value === "in_progress" ||
  value === "closed";

const stringifyParams = (
  searchParams: URLSearchParams,
  pathname: string,
) => {
  const query = searchParams.toString();

  return query ? `${pathname}?${query}` : pathname;
};

export const useTicketListUrlParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const statusParam = searchParams.get("status");

  const status: TicketStatusFilter = isTicketStatusFilter(statusParam)
    ? statusParam
    : "all";

  const pageParam = Number(searchParams.get("page"));

  const page =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const setFilter = (nextStatus: TicketStatusFilter) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", nextStatus);
    }

    params.delete("page");

    router.push(stringifyParams(params, pathname), { scroll: false });
  };

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    router.push(stringifyParams(params, pathname), { scroll: false });
  };

  return { status, page, setFilter, setPage };
};
"use client";

import { useQuery } from "@tanstack/react-query";

import { getTickets } from "@/lib/api/getTickets";

import type { ListTicketsParams } from "@/types/ticket.type";

export const useAdminTickets = (params: ListTicketsParams = {}) => {
  const { page = 1, limit = 10, status = "all" } = params;

  return useQuery({
    queryKey: ["admin-tickets", page, limit, status],
    queryFn: () => getTickets({ page, limit, status }),
    placeholderData: (previousData) => previousData,
  });
};
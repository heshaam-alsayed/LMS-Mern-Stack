"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyTickets } from "@/lib/api/getMyTickets";

import type { ListTicketsParams } from "@/types/ticket.type";

export const useMyTickets = (params: ListTicketsParams = {}) => {
  const { page = 1, limit = 10, status = "all" } = params;

  return useQuery({
    queryKey: ["my-tickets", page, limit, status],
    queryFn: () => getMyTickets({ page, limit, status }),
  });
};
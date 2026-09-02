"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getOrdersStatistics } from "@/lib/api/ordersStatistics";
import { getOrdersMonthlyAnalytics } from "@/lib/api/ordersMonthlyAnalytics";
import { useAppDispatch } from "@/redux/hooks";
import {
  setOrdersMonthlyAnalytics,
  setOrdersStatistics,
} from "@/redux/features/analytics/analyticsSlice";

type Props = {
  year: string;
};

export default function useOrdersAnalytics({ year }: Props) {
  const dispatch = useAppDispatch();

  const statistics = useQuery({
    queryKey: ["orders-statistics", year],
    queryFn: () => getOrdersStatistics(year),
    staleTime: 5 * 60 * 1000,
  });

  const monthly = useQuery({
    queryKey: ["orders-analytics", year],
    queryFn: () => getOrdersMonthlyAnalytics(year),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (statistics.data?.data) {
      dispatch(setOrdersStatistics(statistics.data.data));
    }
  }, [statistics.data, dispatch]);

  useEffect(() => {
    if (monthly.data?.data) {
      dispatch(setOrdersMonthlyAnalytics(monthly.data.data));
    }
  }, [monthly.data, dispatch]);

  return {
     statistics: statistics.data,
    monthly: monthly.data,

    isLoading: statistics.isLoading || monthly.isLoading,

    isError: statistics.isError || monthly.isError,
  };
}

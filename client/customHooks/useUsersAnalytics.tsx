"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getUsersStatistics } from "@/lib/api/usersStatistics";
import { getUsersMonthlyAnalytics } from "@/lib/api/usersMonthlyAnalytics";
import { useAppDispatch } from "@/redux/hooks";
import {
  setUsersMonthlyAnalytics,
  setUsersStatistics,
} from "@/redux/features/analytics/analyticsSlice";

type Props = {
  year: string;
};

export default function useUsersAnalytics({ year }: Props) {
  const dispatch = useAppDispatch();

  const statistics = useQuery({
    queryKey: ["users-statistics", year],
    queryFn: () => getUsersStatistics(year),
    staleTime: 5 * 60 * 1000,
  });

  const monthly = useQuery({
    queryKey: ["users-analytics", year],
    queryFn: () => getUsersMonthlyAnalytics(year),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (statistics.data?.data) {
      dispatch(setUsersStatistics(statistics.data.data));
    }
  }, [statistics.data, dispatch]);

  useEffect(() => {
    if (monthly.data?.data) {
      dispatch(setUsersMonthlyAnalytics(monthly.data.data));
    }
  }, [monthly.data, dispatch]);

  return {
    statistics: statistics.data,
    monthly: monthly.data,

    isLoading: statistics.isLoading || monthly.isLoading,

    isError: statistics.isError || monthly.isError,
  };
}

"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { getCoursesStatistics } from "@/lib/api/coursesStatistics";
import { getCoursesMonthlyAnalytics } from "@/lib/api/coursesMonthlyAnalytics";
import { useAppDispatch } from "@/redux/hooks";
import {
  setCoursesMonthlyAnalytics,
  setCoursesStatistics,
} from "@/redux/features/analytics/analyticsSlice";

type Props = {
  year: string;
};

export default function useCoursesAnalytics({ year }: Props) {
  const dispatch = useAppDispatch();

  const statistics = useQuery({
    queryKey: ["courses-statistics", year],
    queryFn: () => getCoursesStatistics(year),
    staleTime: 5 * 60 * 1000,
  });

  const monthly = useQuery({
    queryKey: ["courses-analytics", year],
    queryFn: () => getCoursesMonthlyAnalytics(year),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (statistics.data?.data) {
      dispatch(setCoursesStatistics(statistics.data.data));
    }
  }, [statistics.data, dispatch]);

  useEffect(() => {
    if (monthly.data?.data) {
      dispatch(setCoursesMonthlyAnalytics(monthly.data.data));
    }
  }, [monthly.data, dispatch]);

  return {
    statistics: statistics.data,
    monthly: monthly.data,

    isLoading: statistics.isLoading || monthly.isLoading,

    isError: statistics.isError || monthly.isError,
  };
}

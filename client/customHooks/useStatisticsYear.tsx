"use client";
import { useRouter, useSearchParams } from "next/navigation";

import { getRecentYears } from "@/app/utils/helper";

export default function useStatisticsYear() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const years = getRecentYears(3);

  const currentYear =
    searchParams.get("year") || new Date().getFullYear().toString();

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("year", year);

    router.push(`?${params.toString()}`);
  };

  return {
    years,
    currentYear,
    handleYearChange,
  };
}

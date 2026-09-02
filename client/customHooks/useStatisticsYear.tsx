"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function useStatisticsYear() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const years = [2026, 2025, 2024, 2023];

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

"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDebounce } from "@/customHooks/useDebounce";
import CourseSelectFilters from "./filters/CourseSelectFilters";
import CourseSearchFilter from "./filters/CourseSearchFilter";
import CoursePriceFilters from "./filters/CoursePriceFilters";

export default function CoursesFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [price, setPrice] = useState({
    min: searchParams.get("price[gte]") || "",
    max: searchParams.get("price[lte]") || "",
  });

  const [estimatedPrice, setEstimatedPrice] = useState({
    min: searchParams.get("estimatePrice[gte]") || "",
    max: searchParams.get("estimatePrice[lte]") || "",
  });

  const debouncedSearch = useDebounce(search, 1000);

  const debouncedPrice = useDebounce(price, 1000);

  const debouncedEstimatedPrice = useDebounce(estimatedPrice, 1000);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key !== "page") {
      params.delete("page");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const updateRangeQuery = (field: string, min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (min) {
      params.set(`${field}[gte]`, min);
    } else {
      params.delete(`${field}[gte]`);
    }

    if (max) {
      params.set(`${field}[lte]`, max);
    } else {
      params.delete(`${field}[lte]`);
    }

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-3">
      <CourseSelectFilters
        searchParams={searchParams}
        updateQuery={updateQuery}
      />

      <div className="flex items-center gap-3">
        <CourseSearchFilter
          search={search}
          setSearch={setSearch}
          debouncedSearch={debouncedSearch}
          updateQuery={updateQuery}
        />

        <CoursePriceFilters
          price={price}
          setPrice={setPrice}
          estimatedPrice={estimatedPrice}
          setEstimatedPrice={setEstimatedPrice}
          debouncedPrice={debouncedPrice}
          debouncedEstimatedPrice={debouncedEstimatedPrice}
          updateRangeQuery={updateRangeQuery}
        />
      </div>
    </div>
  );
}

"use client";

import { getAllCourses } from "@/lib/api/getAllCourses";

import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

import CoursesFilter from "./CoursesFilter";
import CoursesTable from "./CoursesTable";
import { CoursesResponseAdmin } from "@/types/course.type";

export default function AllCourses() {
  const searchParams = useSearchParams();

  const [data, setData] = useState<CoursesResponseAdmin | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const getAllCoursesMutation = useMutation({
    mutationFn: getAllCourses,

    onSuccess: (data) => {
      setData(data);
      setHasFetched(true);
    },

    onError: () => {
      setHasFetched(true);
    },
  });

  useEffect(() => {
    getAllCoursesMutation.mutate(searchParams.toString());
  }, [searchParams]);

  const isLoading = !hasFetched || getAllCoursesMutation.isPending;
  return (
    <div className="space-y-4">
      <CoursesFilter />

      <CoursesTable
        courses={data?.courses ?? []}
        isLoading={isLoading}
        error={getAllCoursesMutation.error}
      />
    </div>
  );
}

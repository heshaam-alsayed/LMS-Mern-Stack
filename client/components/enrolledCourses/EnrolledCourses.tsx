"use client";

import { useQuery } from "@tanstack/react-query";

import { getEnrolledCourses } from "@/lib/api/getEnrolledCourses";

import EnrolledCourseCard from "./EnrolledCourseCard";
import EnrolledCoursesEmpty from "./EnrolledCoursesEmpty";
import EnrolledCoursesError from "./EnrolledCoursesError";
import EnrolledCoursesHeader from "./EnrolledCoursesHeader";
import EnrolledCourseCardSkeleton from "../skeleton/EnrolledCourseCardSkeleton";

export default function EnrolledCourses() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: getEnrolledCourses,
  });

  console.log(data);
  if (isLoading) {
    return (
      <section className="space-y-6">
        <EnrolledCoursesHeader count={0} />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <EnrolledCourseCardSkeleton count={6} />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6">
        <EnrolledCoursesHeader count={0} />

        <EnrolledCoursesError
          message={
            error instanceof Error
              ? error.message
              : "Something went wrong while loading your courses."
          }
          onRetry={() => refetch()}
        />
      </section>
    );
  }

  const courses = data?.progress ?? [];

  if (courses.length === 0) {
    return (
      <section className="space-y-6">
        <EnrolledCoursesHeader count={0} />

        <EnrolledCoursesEmpty />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <EnrolledCoursesHeader count={courses.length} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {courses.map((item) => (
          <EnrolledCourseCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}

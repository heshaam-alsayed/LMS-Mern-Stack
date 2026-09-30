"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getPublicCoursesUser } from "@/lib/api/getPublicCoursesUser";
import CourseCard from "./CourseCard";
import CoursesSectionSkeleton from "../../skeleton/CourseSectionSkeleton";

export default function CoursesSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-courses-user"],
    queryFn: () => getPublicCoursesUser(),
    staleTime: 24 * 60 * 60 * 1000,
  });

  if (isLoading) {
    return <CoursesSectionSkeleton />;
  }

  if (isError || !data?.courses) {
    return null;
  }

  const courses = data.courses.slice(0, 12);
  console.log(data)
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary">
            Featured Courses
          </span>

          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Explore Our Courses
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Learn from expert instructors and build the skills you need to
            achieve your goals.
          </p>
        </div>

        {/* Courses */}
        <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <Link key={course._id} href={`/course/${course._id}`}>
              <CourseCard course={course} />
            </Link>
          ))}
        </div>

        {/* View All Courses */}

        <div className="mt-10 flex justify-center">
          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-2 text-xs font-medium text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-muted/70 hover:text-primary">
            <span>View All Courses</span>

            <ArrowRight className="size-3.5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        </div>
      </div>
    </section>
  );
}

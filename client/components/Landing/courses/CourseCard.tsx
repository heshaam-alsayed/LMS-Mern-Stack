"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Star } from "lucide-react";

import { Course } from "@/types/course.type";

type CourseCardProps = {
  course: Course;
};

const tagClasses =
  "inline-flex h-[22px] items-center gap-1 rounded border border-border px-1 text-xs font-normal leading-[1.2] text-muted-foreground";

export default function CourseCard({ course }: CourseCardProps) {
  const rating = course.ratings ?? 0;

  const filledWidth = `${Math.min(100, Math.max(0, (rating / 5) * 100))}%`;

  const hasDiscount =
    course.estimatePrice &&
    course.estimatePrice > course.price &&
    course.price > 0;

  const lecturesCount = course.totalLectures ?? course.courseData?.length ?? 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:bg-accent/40">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
        {course.thumbnail?.url ? (
          <Image
            src={course.thumbnail.url}
            alt={course.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="rounded-2xl object-cover p-2"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <BookOpen className="size-8 text-muted-foreground/40" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-2 sm:gap-4 sm:p-4">
        <div className="flex flex-1 flex-col gap-2 sm:gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="line-clamp-3 text-[clamp(1.0625rem,0.0925926vi+1.04167rem,1.125rem)] font-medium leading-[1.2] tracking-normal text-foreground">
              <Link
                href={`/course/${course._id}`}
                className="line-clamp-3 after:absolute after:inset-0 after:content-['']">
                {course.name}
              </Link>
            </h3>

            <p className="line-clamp-2 text-base font-normal leading-[1.6] text-muted-foreground">
              {course.description}
            </p>

            <p className="line-clamp-1 text-xs font-normal leading-[1.4] text-muted-foreground">
              {course.instructor?.name || "Instructor"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:gap-4">
          <ul className="flex max-h-[52px] flex-wrap gap-1 overflow-hidden">
            <li className={tagClasses}>
              {rating.toFixed(1)}

              <span className="relative inline-flex size-3.5 shrink-0 items-center justify-center">
                <Star
                  aria-hidden
                  className="absolute size-3.5 fill-none stroke-yellow-600"
                  strokeWidth={1.5}
                />

                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filledWidth }}>
                  <Star
                    aria-hidden
                    className="size-3.5 fill-yellow-600 stroke-yellow-600"
                    strokeWidth={1.5}
                  />
                </span>
              </span>

              <span className="sr-only">out of 5</span>
            </li>

            <li className={tagClasses}>{course.reviewsCount ?? 0} ratings</li>

            {lecturesCount > 0 && (
              <li className={tagClasses}>
                {lecturesCount} {lecturesCount === 1 ? "lecture" : "lectures"}
              </li>
            )}

            {course.totalHours != null && course.totalHours > 0 && (
              <li className={tagClasses}>
                {Number.isInteger(course.totalHours)
                  ? course.totalHours
                  : course.totalHours.toFixed(1)}{" "}
                total hours
              </li>
            )}

            {course.level && (
              <li className={`${tagClasses} capitalize`}>{course.level}</li>
            )}
          </ul>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline">
              <span className="whitespace-nowrap py-1 text-base font-bold leading-none text-foreground">
                {course.price} EGP
              </span>

              {hasDiscount && (
                <span className="ml-2 whitespace-nowrap py-1 text-sm font-normal leading-none text-muted-foreground line-through">
                  {course.estimatePrice} EGP
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

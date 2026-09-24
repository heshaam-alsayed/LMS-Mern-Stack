"use client";

import { CalendarDays, ChevronRight, Globe2, Languages } from "lucide-react";

import { ICoursePublicDetails } from "@/types/course.type";
import CourseStatsBanner from "./CourseStatsBanner";
import { getShortDescription } from "@/lib/utils";
import CoursePurchase from "./CoursePurchased";
import CourseBreadcrumb from "./CourseBreadcrumb";

type Props = {
  course: ICoursePublicDetails;
  onBuyNow: () => void;
  isPurchased: boolean | undefined;
  discountPercentage: number;
};

export default function CourseHero({
  course,
  onBuyNow,
  isPurchased,
  discountPercentage,
}: Props) {
  return (
    <section className="relative border-b border-border bg-muted/40">
      <div className="mx-auto w-full max-w-[1230px] px-4 py-6 sm:px-6 sm:py-4">
        <div
          className="
            grid
            grid-cols-1
            items-start
            gap-8
            lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]
            lg:gap-[25px]

            lg:pb-[100px]
          ">
          <div className="min-w-0 pt-8">
            <CourseBreadcrumb
              category={course.category.title}
              courseName={course.name}
              categoryHref={`/courses/${course.category.slug}`}
            />

            <h1
              className="
                max-w-[820px]
                text-3xl
                font-bold
                leading-[1.15]
                tracking-tight
                text-foreground

                sm:text-4xl

                lg:text-[42px]
              ">
              {course.name}
            </h1>

            {course.description && (
              <p
                className="
                  mt-5
                  max-w-[790px]
                  text-base
                  leading-7
                  text-muted-foreground

                  sm:text-lg
                ">
                {getShortDescription(course.description)}
              </p>
            )}

            <p className="mt-5 text-sm text-muted-foreground">
              Created by{" "}
              <button
                type="button"
                className="
                  font-semibold
                  text-primary
                  underline
                  underline-offset-2
                  transition-opacity
                  hover:opacity-80
                ">
                Course Instructor
              </button>
            </p>

            <div
              className="
                mt-5
                flex
                flex-wrap
                items-center
                gap-x-6
                gap-y-3
                text-sm
                text-muted-foreground
              ">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 shrink-0" />
                <span>Last updated 2/2026</span>
              </div>

              <div className="flex items-center gap-2">
                <Globe2 className="size-4 shrink-0" />
                <span>English</span>
              </div>

              <div className="flex items-center gap-2">
                <Languages className="size-4 shrink-0" />
                <span>English [Auto]</span>
              </div>
            </div>

            <div className="mt-8 block lg:hidden">
              <CourseStatsBanner course={course} />
            </div>

            <div className="mt-8 block lg:hidden">
              <CoursePurchase
                course={course}
                isPurchased={isPurchased}
                discountPercentage={discountPercentage}
                onBuyNow={onBuyNow}
                mobile={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="
          absolute
          bottom-0
          left-1/2
          z-20
          hidden
          w-full
          max-w-[1230px]
          -translate-x-1/2
          translate-y-1/2
          px-4

          sm:px-6

          lg:block
          lg:px-8
        ">
        <div className="w-full lg:w-[65%]">
          <CourseStatsBanner course={course} />
        </div>
      </div>
    </section>
  );
}

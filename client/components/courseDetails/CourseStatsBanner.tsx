"use client";

import { BadgeCheck, Users } from "lucide-react";

import { ICoursePublicDetails } from "@/types/course.type";
import Ratings from "../shared/Ratings";

type Props = {
  course: ICoursePublicDetails;
};

export default function CourseStatsBanner({ course }: Props) {
  const rating = Number(course.ratings ?? 0);
  const reviewsCount = course.reviews?.length ?? 0;
  const studentsCount = course.purchased ?? 0;

  return (
    <section
      className="
        w-full
        overflow-hidden
        rounded-lg
        border
        border-border
        bg-card
        text-card-foreground
        shadow-md
      ">
      <div className="flex min-h-[92px] flex-col md:flex-row">
        {/* =====================================================
            PREMIUM
        ====================================================== */}

        <div
          className="
            flex
            min-h-[92px]
            w-full
            shrink-0
            flex-row
            items-center
            justify-center
            gap-2
            bg-primary
            px-5
            text-primary-foreground

            md:w-[125px]
            md:flex-col
            md:gap-1.5
          ">
          <BadgeCheck className="size-6" strokeWidth={1.8} />

          <span className="text-sm font-bold leading-none">Premium</span>
        </div>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="flex min-w-0 flex-1 flex-col md:flex-row">
          {/* ===================================================
              PREMIUM MESSAGE
          ==================================================== */}

          <div
            className="
              flex
              min-w-0
              flex-1
              items-center
              px-5
              py-4

              md:px-5
            ">
            <p
              className="
                max-w-[400px]
                text-sm
                leading-5
                text-foreground
              ">
              Access 28,000+ top-rated courses with{" "}
              <button
                type="button"
                className="
                  font-semibold
                  text-primary
                  underline
                  decoration-1
                  underline-offset-2
                  transition-colors
                  hover:text-primary/80
                ">
                Personal Plan
              </button>
              .
            </p>
          </div>

          {/* ===================================================
              RATING
          ==================================================== */}

          <div
            className="
              flex
              min-w-[150px]
              items-center
              justify-center
              border-t
              border-border
              px-4
              py-4

              md:border-l
              md:border-t-0
            ">
            <div className="text-center">
              <div
                className="
                  text-xl
                  font-bold
                  leading-none
                  text-foreground
                ">
                {rating.toFixed(1)}
              </div>

              <div className="mt-1">
                <Ratings rating={course.ratings} />
              </div>

              <button
                type="button"
                className="
                  mt-1
                  text-[11px]
                  text-muted-foreground
                  underline
                  underline-offset-2
                  transition-colors
                  hover:text-primary
                ">
                {reviewsCount} ratings
              </button>
            </div>
          </div>

          {/* ===================================================
              STUDENTS
          ==================================================== */}

          <div
            className="
              flex
              min-w-[135px]
              items-center
              justify-center
              border-t
              border-border
              px-4
              py-4

              md:border-l
              md:border-t-0
            ">
            <div className="text-center">
              <Users
                className="
                  mx-auto
                  size-5
                  text-muted-foreground
                "
                strokeWidth={1.8}
              />

              <div
                className="
                  mt-1
                  text-xl
                  font-bold
                  leading-none
                  text-foreground
                ">
                {studentsCount}
              </div>

              <div
                className="
                  mt-1
                  text-[11px]
                  text-muted-foreground
                ">
                learners
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { BadgeCheck, Check } from "lucide-react";

import { ICoursePublicDetails } from "@/types/course.type";
import CourseBenefits from "./CourseBenefits";
import CoursePrerequisites from "./CoursePrerequisites";
import CourseContentList from "./CourseContentList";
import CourseReviews from "./CourseReviews";

type Props = {
  course: ICoursePublicDetails;
  isPurchased: boolean | undefined;
};

export default function CourseContent({ course, isPurchased }: Props) {
  return (
    <section
      className="
        mx-auto
        max-w-[1230px]
        px-4
        py-10

        sm:px-6

        lg:px-8
        lg:py-14
      ">
      <div className="w-full lg:w-[65%] mt-8 space-y-6">
        <div>
          <CourseBenefits benefits={course.benefits} />
        </div>

        <div>
          <CoursePrerequisites prerequisites={course.prerequisites} />
        </div>
        <div>
          <CourseContentList
            data={course.courseData}
            isPurchased={isPurchased}
          />
        </div>
        <section className="mt-12">
          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
              text-foreground
            ">
            Course Details
          </h2>

          <div className="mt-5">
            <p
              className="
                whitespace-pre-line
                text-sm
                leading-7
                text-muted-foreground

                sm:text-[15px]
              ">
              {course.description}
            </p>
          </div>
          <CourseReviews reviews={course.reviews}/>
        </section>
      </div>
    </section>
  );
}

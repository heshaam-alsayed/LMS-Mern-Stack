"use client";

import Image from "next/image";
import { FaPlayCircle, FaStar, FaUsers } from "react-icons/fa";

import { Course } from "@/types/course.type";

type CourseCardProps = {
  course: Course;
};

export default function CourseCard({ course }: CourseCardProps) {
  console.log(course);
  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card ">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.thumbnail?.url || "/course-placeholder.jpg"}
          alt={course.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Course Name */}
        <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-foreground">
          {course.name}
        </h3>

        {/* Rating + Price */}
        <div className="mt-3 flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <FaStar className="size-3.5 text-yellow-500" />

            <span className="text-xs font-medium text-foreground">
              {(course.ratings ?? 0).toFixed(1)}
            </span>

            <span className="text-xs text-muted-foreground">Rating</span>
          </div>

          {/* Price */}
          <span className="text-base font-bold text-primary">
            ${course.price}
          </span>
        </div>

        {/* Course Info */}
        <div className="mt-3 flex items-center justify-between gap-4 text-xs text-muted-foreground">
          {/* Lectures */}
          <div className="flex items-center gap-1.5">
            <FaPlayCircle className="size-3.5" />

            <span>{course.courseData?.length ?? 0} Lectures</span>
          </div>

          {/* Students */}
          <div className="flex items-center gap-1.5">
            <FaUsers className="size-3.5" />

            <span>{course.purchased ?? 0} Students</span>
          </div>
        </div>
      </div>
    </div>
  );
}

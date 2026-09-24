import Image from "next/image";
import Link from "next/link";
import { BookOpen, PlayCircle, Star } from "lucide-react";

import { ICourseProgress } from "@/types/courseProgress.type";
import EnrolledCourseProgress from "./EnrolledCoursesProgress";

interface EnrolledCourseCardProps {
  item: ICourseProgress;
}

export default function EnrolledCourseCard({ item }: EnrolledCourseCardProps) {
  const { course } = item;

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md">
      <Link href={`/course/${course._id}`}>
        <div className="relative aspect-video overflow-hidden bg-muted">
          {course.thumbnail?.url ? (
            <Image
              src={course.thumbnail.url}
              alt={course.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
        </div>
      </Link>

      <div className="space-y-5 p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
              {course.level}
            </span>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-current text-amber-400" />

              <span>{course.ratings?.toFixed(1) ?? "0.0"}</span>
            </div>
          </div>

          <Link href={`/course/${course._id}`}>
            <h3 className="line-clamp-2 text-lg font-semibold leading-6 text-foreground transition-colors group-hover:text-primary">
              {course.name}
            </h3>
          </Link>
        </div>

        <EnrolledCourseProgress
          percentage={item.progressPercentage}
          completedCount={item.completedCount}
          totalLectures={item.totalLectures}
        />

        <Link
          href={`/course/${item.course._id}`}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <PlayCircle className="h-4 w-4" />
          View Course
        </Link>
      </div>
    </article>
  );
}

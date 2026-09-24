"use client";

import Image from "next/image";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  PlayCircle,
  Star,
} from "lucide-react";

import { IAdminUserCourse } from "@/types/operation.type";

interface PurchasedCoursesProps {
  courses: IAdminUserCourse[];
}

export default function UserPurchasedCoursesOperation({
  courses,
}: PurchasedCoursesProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatLastAccessed = (date?: string | null) => {
    if (!date) return "Not accessed yet";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!courses?.length) {
    return (
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Purchased Courses
            </h2>

            <p className="text-sm text-muted-foreground">
              Courses purchased by this user and their learning progress
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted/40 text-muted-foreground">
            <BookOpen className="h-6 w-6" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-foreground">
            No Purchased Courses
          </h3>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            This user has not purchased any courses yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Purchased Courses
          </h2>

          <p className="text-sm text-muted-foreground">
            Courses purchased by this user and their learning progress
          </p>
        </div>
      </div>

      {/* Courses */}
      <div className="space-y-4">
        {courses.map((item) => {
          const { course, purchase, progress } = item;

          const progressPercentage = Math.min(
            Math.max(progress?.progressPercentage ?? 0, 0),
            100,
          );

          const completedCount = progress?.completedCount ?? 0;
          const totalLectures = progress?.totalLectures ?? 0;

          const isCompleted = progressPercentage === 100 && totalLectures > 0;

          return (
            <article
              key={course._id}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <div className="p-4 sm:p-5">
                {/* Course Top */}
                <div className="flex flex-col gap-5 lg:flex-row">
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-border bg-muted sm:w-64 lg:w-72">
                    {course.thumbnail?.url ? (
                      <Image
                        src={course.thumbnail.url}
                        alt={course.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 288px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted/40 text-muted-foreground">
                        <BookOpen className="h-10 w-10" />
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  {/* Course Information */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
                        {course.level}
                      </span>

                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          <PlayCircle className="h-3.5 w-3.5" />
                          In Progress
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-snug text-foreground sm:text-xl">
                      {course.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-current text-primary" />
                        <span className="font-medium text-foreground">
                          {course.ratings.toFixed(1)}
                        </span>
                        <span>Rating</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        <span>Purchased {formatDate(purchase.createdAt)}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-5">
                      <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Purchase Price
                          </p>

                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-xl font-bold tracking-tight text-foreground">
                              ${purchase.price.toLocaleString()}
                            </span>

                            {course.estimatePrice > course.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${course.estimatePrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-right">
                          <p className="text-[11px] text-muted-foreground">
                            Course Price
                          </p>

                          <p className="text-sm font-semibold text-foreground">
                            ${course.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mt-5 border-t border-border/60 pt-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-primary" />

                        <p className="text-sm font-semibold text-foreground">
                          Learning Progress
                        </p>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {completedCount} of {totalLectures} lectures completed
                      </p>
                    </div>

                    <div className="flex w-full items-center gap-3 sm:w-[320px] lg:w-[420px]">
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? "bg-emerald-600" : "bg-primary"
                          }`}
                          style={{
                            width: `${progressPercentage}%`,
                          }}
                        />
                      </div>

                      <span className="min-w-[44px] text-right text-sm font-semibold text-foreground">
                        {progressPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Current Lecture + Last Access */}
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <PlayCircle className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            Current Lecture
                          </p>

                          <p className="mt-1 line-clamp-2 text-sm font-medium text-foreground">
                            {progress?.currentLecture?.title ??
                              "No lecture started"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Clock3 className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            Last Accessed
                          </p>

                          <p className="mt-1 text-sm font-medium text-foreground">
                            {formatLastAccessed(progress?.lastAccessedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

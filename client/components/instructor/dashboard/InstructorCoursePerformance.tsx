"use client";

import { useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  Star,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Pagination, { PaginationData } from "@/components/shared/Pagination";

import useMyOrganizationCoursesPerformance from "@/customHooks/useMyOrganizationCoursesPerformance";

import { OrganizationCoursePerformance } from "@/types/organization.type";

import InstructorCoursePerformanceSkeleton from "./InstructorCoursePerformanceSkeleton";
import CourseAnalyticsModal from "./CourseAnalyticsModal";

const COURSE_PER_PAGE = 10;

function getCompletionBarColor(completion: number) {
  if (completion >= 75) {
    return "bg-emerald-500";
  }

  if (completion >= 40) {
    return "bg-amber-500";
  }

  return "bg-destructive";
}

function CoursePerformanceRow({
  stat,
  onViewAnalytics,
}: {
  stat: OrganizationCoursePerformance;
  onViewAnalytics: (course: OrganizationCoursePerformance) => void;
}) {
  return (
    <TableRow className="border-border/60 transition-colors hover:bg-muted/40">
      {/* Course */}
      <TableCell className="py-5 pl-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <GraduationCap className="h-4.5 w-4.5 text-primary" />
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">
              {stat.course}
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Course performance
            </p>
          </div>
        </div>
      </TableCell>

      {/* Students */}
      <TableCell className="py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </div>

          <div>
            <p className="font-semibold text-foreground">
              {stat.students.toLocaleString()}
            </p>

            <p className="text-xs text-muted-foreground">students</p>
          </div>
        </div>
      </TableCell>

      {/* Revenue */}
      <TableCell className="py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>

          <div>
            <p className="font-semibold text-foreground">
              ${stat.revenue.toLocaleString()}
            </p>

            <p className="text-xs text-muted-foreground">revenue</p>
          </div>
        </div>
      </TableCell>

      {/* Rating */}
      <TableCell className="py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <Star className="h-4 w-4 text-muted-foreground" />
          </div>

          <div>
            <p className="font-semibold text-foreground">
              {stat.rating.toFixed(1)}
            </p>

            <p className="text-xs text-muted-foreground">rating</p>
          </div>
        </div>
      </TableCell>

      {/* Completion */}
      <TableCell className="py-5">
        <div className="min-w-[180px]">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />

              <span className="text-sm font-medium text-foreground">
                Completion
              </span>
            </div>

            <span className="text-sm font-semibold text-foreground">
              {stat.completion}%
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${getCompletionBarColor(
                stat.completion,
              )}`}
              style={{
                width: `${Math.min(Math.max(stat.completion, 0), 100)}%`,
              }}
            />
          </div>
        </div>
      </TableCell>

      {/* Action */}
      <TableCell className="py-5 pr-6 text-right">
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg"
          onClick={() => onViewAnalytics(stat)}>
          <BarChart3 className="mr-1.5 h-4 w-4" />
          View analytics
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function InstructorCoursePerformance() {
  const [page, setPage] = useState(1);

  const [selectedCourse, setSelectedCourse] =
    useState<OrganizationCoursePerformance | null>(null);

  const { statistics, pagination, isLoading, isError, error, refetch } =
    useMyOrganizationCoursesPerformance({
      page,
      limit: COURSE_PER_PAGE,
    });

  if (isLoading) {
    return <InstructorCoursePerformanceSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-border bg-background shadow-sm">
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Could not load course performance
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted-foreground">
              {error?.message ??
                "We could not load your course performance right now."}
            </p>
          </div>

          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const hasCourses = statistics.length > 0;

  return (
    <section className="space-y-5">
      {/* Section Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Course performance
          </h2>

          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            Track student enrollment, revenue, ratings, and course completion.
          </p>
        </div>
      </div>

      {hasCourses ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
          {/* Table Summary */}
          <div className="flex items-center justify-between gap-4 border-b border-border bg-muted/20 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Performance overview
                </p>

                <p className="text-xs text-muted-foreground">
                  {pagination?.total ?? 0}{" "}
                  {pagination?.total === 1 ? "course" : "courses"}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/20 hover:bg-muted/20">
                  <TableHead className="h-12 pl-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Course
                  </TableHead>

                  <TableHead className="h-12 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Students
                  </TableHead>

                  <TableHead className="h-12 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Revenue
                  </TableHead>

                  <TableHead className="h-12 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Rating
                  </TableHead>

                  <TableHead className="h-12 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Completion
                  </TableHead>

                  <TableHead className="h-12 pr-6 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {statistics.map((stat) => (
                  <CoursePerformanceRow
                    key={stat?._id}
                    stat={stat}
                    onViewAnalytics={setSelectedCourse}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {pagination && pagination.total > 0 ? (
            <div className="border-t border-border bg-muted/10">
              <Pagination
                pagination={pagination as PaginationData}
                itemLabel="courses"
                onNext={() => setPage(pagination.currentPage + 1)}
                onPrevious={() => setPage(pagination.currentPage - 1)}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-background shadow-sm">
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="font-semibold text-foreground">
              No course performance yet
            </p>

            <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
              Once you publish a course and students start enrolling,
              performance metrics will appear here.
            </p>
          </div>
        </div>
      )}

      <CourseAnalyticsModal
        open={Boolean(selectedCourse)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCourse(null);
          }
        }}
        courseId={selectedCourse?._id ?? null}
        courseName={selectedCourse?.course ?? ""}
      />
    </section>
  );
}

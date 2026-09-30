"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  HelpCircle,
  MessageSquareText,
  Sparkles,
  Star,
} from "lucide-react";

import { getOrganizationCourseDetail } from "@/lib/api/getOrganizationCourseDetail";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import InstructorQuestionCard from "./InstructorQuestionCard";
import InstructorReviewCard from "./InstructorReviewCard";

const DASH = "—";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const formatRating = (value: number) => {
  if (!Number.isFinite(value)) {
    return "0.0";
  }

  return value.toFixed(1);
};

const parseTags = (value?: string) =>
  (value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export default function InstructorCourseDetail({ id }: { id: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"questions" | "reviews">(
    "questions",
  );

  const queryKey = ["instructor-course-detail", id];

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () => getOrganizationCourseDetail(id),
    enabled: Boolean(id),
  });

  const course = data?.course;
  const organization = data?.organization;
  const summary = data?.summary;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-9 w-56 animate-pulse rounded-lg bg-muted" />

        <div className="overflow-hidden rounded-2xl border border-border bg-background">
          <div className="aspect-video w-full animate-pulse bg-muted" />
          <div className="space-y-4 p-6">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[0, 1, 2, 3].map((k) => (
                <Skeleton key={k} className="h-24" />
              ))}
            </div>
          </div>
        </div>

        <Skeleton className="h-96" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-border bg-background">
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Could not load course
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              {error?.message ?? "This course does not exist in your organization."}
            </p>
          </div>

          <Button onClick={() => router.push("/instructor/organization-courses")}>
            Back to courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="ghost"
        className="gap-2 text-muted-foreground"
        onClick={() => router.push("/instructor/organization-courses")}>
        <ArrowLeft className="h-4 w-4" />
        Back to courses
      </Button>

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="relative aspect-video w-full bg-muted">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.name}
              fill
              sizes="(max-width: 1024px) 100vw, 90vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/50" />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 text-white">
            <div className="min-w-0">
              <p className="truncate text-xs uppercase tracking-wide text-white/80">
                {organization.name}
              </p>
              <h1 className="mt-0.5 line-clamp-2 text-lg font-semibold sm:text-xl">
                {course.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {course.status ? (
                <Badge className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/20">
                  {course.status}
                </Badge>
              ) : null}
              {course.level ? (
                <Badge className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/20">
                  {course.level}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {course.description && (
            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
              {course.description}
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Enrollments
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {formatNumber(course.purchased)}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-medium text-muted-foreground">Rating</p>
              <p className="mt-1 flex items-baseline gap-1 text-lg font-semibold text-foreground">
                {formatRating(course.ratings)}
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              </p>
              <p className="text-xs text-muted-foreground">
                {formatNumber(summary.totalReviews)} reviews
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Lectures
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {course.totalLectures}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Questions
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {summary.totalQuestions}
              </p>
              <p className="text-xs text-muted-foreground">
                {summary.answeredQuestions} answered
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {course.category && (
              <Badge variant="secondary">{course.category.title}</Badge>
            )}
            {parseTags(course.tags)
              .slice(0, 4)
              .map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
            <p className="text-xs text-muted-foreground">
              Created {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : DASH}
            </p>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/course/${course._id}`}>View public page</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageSquareText className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-semibold text-foreground">
              Student engagement
            </h2>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-muted/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("questions")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "questions"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}>
              <HelpCircle className="h-3.5 w-3.5" />
              Questions ({summary.totalQuestions})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "reviews"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}>
              <Star className="h-3.5 w-3.5" />
              Reviews ({summary.totalReviews})
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === "questions" ? (
            data.questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground">No questions yet</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Students haven't asked any questions on this course.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.questions.map((question) => (
                  <InstructorQuestionCard
                    key={question._id}
                    question={question}
                    courseId={course._id}
                    queryKey={queryKey}
                  />
                ))}
              </div>
            )
          ) : data.reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                <Star className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">No reviews yet</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                This course hasn't received any reviews.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.reviews.map((review) => (
                <InstructorReviewCard
                  key={review._id}
                  review={review}
                  courseId={course._id}
                  queryKey={queryKey}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

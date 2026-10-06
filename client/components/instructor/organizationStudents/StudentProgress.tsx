"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Mail,
  Phone,
  PlayCircle,
  Trophy,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

import { getStudentProgress } from "@/lib/api/getStudentProgress";

import {
  GetStudentProgressResponse,
  OrganizationStudentStatus,
} from "@/types/organization.type";

const DASH = "—";

type ProgressTier = "none" | "low" | "half" | "high" | "done";

const getProgressTier = (percentage: number): ProgressTier => {
  if (percentage >= 100) return "done";
  if (percentage >= 70) return "high";
  if (percentage >= 35) return "half";
  if (percentage > 0) return "low";

  return "none";
};

const PROGRESS_PILL_STYLES: Record<
  ProgressTier,
  { pill: string; bar: string; text: string }
> = {
  none: {
    pill: "bg-slate-900/80 text-slate-100",
    bar: "bg-slate-400",
    text: "text-slate-500 dark:text-slate-400",
  },
  low: {
    pill: "bg-rose-500/90 text-white",
    bar: "bg-rose-500",
    text: "text-rose-500",
  },
  half: {
    pill: "bg-amber-500/90 text-white",
    bar: "bg-amber-500",
    text: "text-amber-500",
  },
  high: {
    pill: "bg-sky-500/90 text-white",
    bar: "bg-sky-500",
    text: "text-sky-500",
  },
  done: {
    pill: "bg-emerald-500/90 text-white",
    bar: "bg-emerald-500",
    text: "text-emerald-500",
  },
};

const PROGRESS_LABELS: Record<ProgressTier, string> = {
  none: "Not started",
  low: "Just started",
  half: "In progress",
  high: "Almost there",
  done: "Completed",
};

const STATUS_STYLES: Record<string, string> = {
  active:
    "rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium capitalize text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400",
  pending:
    "rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium capitalize text-amber-600 hover:bg-amber-500/10 dark:text-amber-400",
  suspended:
    "rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium capitalize text-rose-600 hover:bg-rose-500/10 dark:text-rose-400",
  published:
    "rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium capitalize text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400",
  draft:
    "rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-medium capitalize text-slate-600 hover:bg-slate-500/10 dark:text-slate-400",
  archived:
    "rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium capitalize text-amber-600 hover:bg-amber-500/10 dark:text-amber-400",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const formatDate = (value?: string | null) => {
  if (!value) {
    return DASH;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return DASH;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>

        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>

      {hint ? (
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function StudentHeader({ data }: { data: GetStudentProgressResponse }) {
  const { student } = data;

  const status = student.status as OrganizationStudentStatus;

  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
          <Avatar className="h-16 w-16 shrink-0">
            {student.avatar?.url ? (
              <AvatarImage src={student.avatar.url} alt={student.name} />
            ) : null}

            <AvatarFallback className="text-base font-semibold">
              {getInitials(student.name || "?")}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {student.name || DASH}
              </h1>

              <Badge
                variant="secondary"
                className={STATUS_STYLES[status.toLowerCase()] ?? ""}>
                {student.status}
              </Badge>
            </div>

            <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{student.email || DASH}</span>
            </p>

            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{student.phone || DASH}</span>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 px-5 py-4 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            Overall progress
          </p>

          <p
            className={cn(
              "mt-1 text-2xl font-semibold tracking-tight",
              PROGRESS_PILL_STYLES[
                getProgressTier(data.summary.overallPercentage)
              ].text,
            )}>
            {data.summary.overallPercentage}%
          </p>
        </div>
      </div>

      <div className="mt-5">
        <Progress
          value={data.summary.overallPercentage}
          className="h-2"
          indicatorClassName={
            PROGRESS_PILL_STYLES[
              getProgressTier(data.summary.overallPercentage)
            ].bar
          }
        />
      </div>
    </div>
  );
}

function CourseCard({
  item,
}: {
  item: GetStudentProgressResponse["courses"][number];
}) {
  const { course, progressPercentage, completedCount, totalLectures } = item;

  const isDone = progressPercentage === 100;
  const notStarted = progressPercentage === 0;

  const progressTier = getProgressTier(progressPercentage);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-shadow hover:shadow-md">
      <Link
        href={`/course/${course._id}`}
        className="relative block aspect-video w-full overflow-hidden bg-muted">
        {course.thumbnail?.url ? (
          <Image
            src={course.thumbnail.url}
            alt={course.name || "Course"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-8 w-8 text-muted-foreground/50" />
          </div>
        )}

        <span
          className={cn(
            "absolute right-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-sm",
            PROGRESS_PILL_STYLES[progressTier].pill,
          )}>
          {progressPercentage}%
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link
          href={`/course/${course._id}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-foreground hover:text-primary">
          {course.name || DASH}
        </Link>

        <p className="mt-1 truncate text-xs text-muted-foreground">
          {course.category?.title || "Course"}
        </p>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">
              {completedCount}/{totalLectures} lessons
            </span>

            <span
              className={cn(
                "font-semibold",
                PROGRESS_PILL_STYLES[progressTier].text,
              )}>
              {PROGRESS_LABELS[progressTier]}
            </span>
          </div>

          <Progress
            value={progressPercentage}
            className="mt-2 h-1.5"
            indicatorClassName={PROGRESS_PILL_STYLES[progressTier].bar}
          />
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            {isDone ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <PlayCircle className="h-3.5 w-3.5" />
            )}

            {isDone ? "Completed" : notStarted ? "Not started" : "In progress"}
          </span>

          <span className="truncate">
            {item.lastAccessedAt
              ? formatDate(item.lastAccessedAt)
              : "No activity"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function StudentProgress({ id }: { id: string }) {
  const router = useRouter();

  const studentId = id;

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["student-progress", studentId],
    queryFn: () => getStudentProgress(studentId),
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-9 w-52 animate-pulse rounded-lg bg-muted" />

        <div className="h-48 animate-pulse rounded-2xl bg-muted/60" />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((key) => (
            <div key={key} className="h-28 animate-pulse rounded-2xl bg-muted/60" />
          ))}
        </div>

        <div className="h-40 animate-pulse rounded-2xl bg-muted/60" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-border bg-background">
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Could not load progress
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              {error?.message ??
                "This student is not enrolled in your courses."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                refetch();
              }}>
              Try again
            </Button>

            <Button
              onClick={() => router.push("/instructor/organization-students")}>
              Back to students
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { summary, organization } = data;

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="ghost"
        className="gap-2 text-muted-foreground"
        onClick={() => router.push("/instructor/organization-students")}>
        <ArrowLeft className="h-4 w-4" />
        Back to students
      </Button>

      <StudentHeader data={data} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="My courses"
          value={summary.totalCourses}
          hint={`at ${organization.name}`}
          icon={<BookOpen className="h-4 w-4" />}
        />

        <StatCard
          label="Completed"
          value={summary.completedCourses}
          hint="finished courses"
          icon={<Trophy className="h-4 w-4" />}
        />

        <StatCard
          label="In progress"
          value={summary.startedCourses}
          hint="started courses"
          icon={<PlayCircle className="h-4 w-4" />}
        />

        <StatCard
          label="Lessons"
          value={`${summary.completedLectures}/${summary.totalLectures}`}
          hint="watched in total"
          icon={<GraduationCap className="h-4 w-4" />}
        />
      </div>

      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </span>

          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Course progress
          </h2>
        </div>

        {data.courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.courses.map((item) => (
              <CourseCard key={item.course._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="font-medium text-foreground">No courses yet</p>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              This student has not purchased any of your courses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

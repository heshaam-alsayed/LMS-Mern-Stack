"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  Eye,
  MessageSquareText,
  MoreHorizontal,
  Pencil,
  RefreshCw,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";

import { Course, CourseStatusType } from "@/types/course.type";

import OrganizationCoursesTableSkeleton from "@/components/skeleton/OrganizationCoursesTableSkeleton";

const LEVEL_STYLES: Record<string, string> = {
  beginner:
    "rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400",
  intermediate:
    "rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 hover:bg-amber-500/10 dark:text-amber-400",
  advanced:
    "rounded-md bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-500/10 dark:text-rose-400",
};

const STATUS_STYLES: Record<string, string> = {
  published:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  draft:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  archived: "border-muted-foreground/30 bg-muted text-muted-foreground",
};

const STATUS_OPTIONS: { value: CourseStatusType; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

interface OrganizationCoursesTableProps {
  courses: Course[];
  isLoading?: boolean;
  error?: Error | null;
  onStatusChange?: (courseId: string, status: CourseStatusType) => void;
  changingCourseId?: string | null;
}

export default function OrganizationCoursesTable({
  courses,
  isLoading = false,
  error = null,
  onStatusChange,
  changingCourseId = null,
}: OrganizationCoursesTableProps) {
  if (isLoading) {
    return <OrganizationCoursesTableSkeleton />;
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="border-b bg-muted/30 hover:bg-muted/30">
            <TableHead className="h-12 w-[320px] px-5 font-semibold">
              Course
            </TableHead>

            <TableHead className="h-12 font-semibold">Level</TableHead>

            <TableHead className="h-12 font-semibold">Status</TableHead>

            <TableHead className="h-12 font-semibold">Price</TableHead>

            <TableHead className="h-12 font-semibold">Performance</TableHead>

            <TableHead className="h-12 font-semibold">Created</TableHead>

            <TableHead className="h-12 w-[80px] text-center font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {error ? (
            <TableRow>
              <TableCell colSpan={7} className="h-64">
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">
                      Failed to load courses
                    </p>

                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                      {error.message ||
                        "Something went wrong while loading your courses."}
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <TableRow
                key={course._id}
                className="group border-b last:border-0 hover:bg-muted/30">
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {course.thumbnail?.url ? (
                        <Image
                          src={course.thumbnail.url}
                          alt={course.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/10">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="max-w-[240px] truncate font-medium text-foreground">
                        {course.name}
                      </p>

                      <p className="mt-0.5 max-w-[240px] truncate text-xs text-muted-foreground">
                        {course.description}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      LEVEL_STYLES[course.level] ?? LEVEL_STYLES.beginner
                    }>
                    {course.level}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={`capitalize ${STATUS_STYLES[course.status ?? "draft"] ?? ""}`}>
                    {course.status ?? "draft"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      ${course.price.toLocaleString()}
                    </span>

                    {course.estimatePrice > course.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ${course.estimatePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>

                      <span className="font-medium text-foreground">
                        {course.ratings.toFixed(1)}
                      </span>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {course.purchased.toLocaleString()} purchases
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(course.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />

                        <span className="sr-only">
                          Open actions for {course.name}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      sideOffset={6}
                      className="w-48">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/instructor/organization-courses/${course._id}`}
                          className="cursor-pointer">
                          <Eye className="mr-2.5 h-4 w-4 text-muted-foreground" />
                          View Course
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href={`/instructor/organization-courses/${course._id}/edit`}
                          className="cursor-pointer">
                          <Pencil className="mr-2.5 h-4 w-4 text-muted-foreground" />
                          Edit Course
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href={`/instructor/organization-courses/${course._id}/details`}
                          className="cursor-pointer">
                          <MessageSquareText className="mr-2.5 h-4 w-4 text-muted-foreground" />
                          Questions & Reviews
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="cursor-pointer">
                          <RefreshCw className="mr-2.5 h-4 w-4 text-muted-foreground" />
                          Change Status
                        </DropdownMenuSubTrigger>

                        <DropdownMenuSubContent>
                          {STATUS_OPTIONS.map((option) => (
                            <DropdownMenuItem
                              key={option.value}
                              disabled={
                                changingCourseId === course._id ||
                                course.status === option.value
                              }
                              className="cursor-pointer"
                              onClick={() =>
                                onStatusChange?.(course._id, option.value)
                              }>
                              {option.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-48">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <p className="font-medium text-foreground">
                    No courses found
                  </p>

                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Try adjusting your filters, or create your first course to
                    get started.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

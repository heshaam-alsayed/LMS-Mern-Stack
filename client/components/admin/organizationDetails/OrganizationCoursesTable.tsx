"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertCircle, BookOpen, Eye } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { Course } from "@/types/course.type";

import CoursesTableSkeleton from "@/components/skeleton/CoursesTableSkeleton";

interface OrganizationCoursesTableProps {
  courses: Course[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function OrganizationCoursesTable({
  courses,
  isLoading = false,
  error = null,
}: OrganizationCoursesTableProps) {
  if (isLoading) {
    return <CoursesTableSkeleton />;
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border bg-background">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[320px]">Course</TableHead>

              <TableHead>Level</TableHead>

              <TableHead>Price</TableHead>

              <TableHead>Performance</TableHead>

              <TableHead>Created</TableHead>

              <TableHead className="w-[60px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                      <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>

                    <div>
                      <p className="font-semibold text-foreground">
                        Failed to load courses
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {error.message ||
                          "Something went wrong while loading courses."}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <TableRow
                  key={course._id}
                  className="bg-muted/40 transition-colors hover:bg-muted/80">
                  <TableCell>
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
                          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[220px] truncate font-medium text-foreground">
                          {course.name}
                        </p>

                        <p className="mt-1 line-clamp-1 max-w-[220px] text-xs text-muted-foreground">
                          {course.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {course.level}
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

                        <span className="font-medium">
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

                  <TableCell>
                    <Link
                      href={`/admin/courses/operation-course/${course._id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`View ${course.name}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <BookOpen className="mb-1 h-8 w-8 text-muted-foreground/50" />

                    <p className="font-medium">No courses found</p>

                    <p className="text-sm text-muted-foreground">
                      This organization has no courses yet.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

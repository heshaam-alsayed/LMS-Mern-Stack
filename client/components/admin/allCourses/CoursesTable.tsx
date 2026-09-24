"use client";

import Image from "next/image";
import { Eye, MoreHorizontal, Pencil, Trash2, AlertCircle } from "lucide-react";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course.type";
import CoursesTableSkeleton from "@/components/skeleton/CoursesTableSkeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CoursesTableProps {
  courses: Course[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function CoursesTable({
  courses,
  isLoading = false,
  error = null,
}: CoursesTableProps) {
  // ==================== LOADING ====================
  const router = useRouter();
  if (isLoading) {
    return <CoursesTableSkeleton />;
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border bg-background">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[900px]">
          {/* ==================== HEADER ==================== */}

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

          {/* ==================== BODY ==================== */}

          <TableBody>
            {/* ==================== ERROR ==================== */}

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
                  className="bg-muted/40 transition-colors hover:bg-muted/80 hover:cursor-pointer">
                  {/* ==================== COURSE ==================== */}

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

                        <p className="mt-1 text-xs text-muted-foreground">
                          ID: {course._id}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* ==================== LEVEL ==================== */}

                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {course.level}
                    </Badge>
                  </TableCell>

                  {/* ==================== PRICE ==================== */}

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

                  {/* ==================== PERFORMANCE ==================== */}

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

                  {/* ==================== CREATED ==================== */}

                  <TableCell>
                    <span className="whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(course.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </TableCell>

                  {/* ==================== ACTIONS ==================== */}

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />

                          <span className="sr-only">Open actions</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <Link
                          href={`/admin/courses/operation-course/${course._id}`}>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                        </Link>

                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/edit-course/${course._id}`)
                          }>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => console.log("Delete:", course._id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              /* ==================== EMPTY ==================== */

              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <p className="font-medium">No courses found</p>

                    <p className="text-sm text-muted-foreground">
                      There are no courses to display.
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

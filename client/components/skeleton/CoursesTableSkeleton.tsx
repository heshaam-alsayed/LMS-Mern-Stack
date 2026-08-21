"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

interface CoursesTableSkeletonProps {
  rows?: number;
}

export default function CoursesTableSkeleton({
  rows = 8,
}: CoursesTableSkeletonProps) {
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

          {/* ==================== SKELETON BODY ==================== */}

          <TableBody>
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow key={index}>
                {/* ==================== COURSE ==================== */}

                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}

                    <Skeleton className="h-12 w-20 shrink-0 rounded-md" />

                    {/* Course Info */}

                    <div className="flex min-w-0 flex-col gap-2">
                      <Skeleton className="h-4 w-[180px]" />

                      <Skeleton className="h-3 w-[130px]" />
                    </div>
                  </div>
                </TableCell>

                {/* ==================== LEVEL ==================== */}

                <TableCell>
                  <Skeleton className="h-6 w-[90px] rounded-full" />
                </TableCell>

                {/* ==================== PRICE ==================== */}

                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[70px]" />

                    <Skeleton className="h-3 w-[55px]" />
                  </div>
                </TableCell>

                {/* ==================== PERFORMANCE ==================== */}

                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[55px]" />

                    <Skeleton className="h-3 w-[110px]" />
                  </div>
                </TableCell>

                {/* ==================== CREATED ==================== */}

                <TableCell>
                  <Skeleton className="h-4 w-[90px]" />
                </TableCell>

                {/* ==================== ACTIONS ==================== */}

                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

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

interface OrganizationCoursesTableSkeletonProps {
  rows?: number;
}

export default function OrganizationCoursesTableSkeleton({
  rows = 8,
}: OrganizationCoursesTableSkeletonProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="border-b bg-muted/30 hover:bg-muted/30">
            <TableHead className="h-12 w-[320px] px-5 font-semibold">
              Course
            </TableHead>

            <TableHead className="h-12 font-semibold">Level</TableHead>

            <TableHead className="h-12 font-semibold">Price</TableHead>

            <TableHead className="h-12 font-semibold">Performance</TableHead>

            <TableHead className="h-12 font-semibold">Created</TableHead>

            <TableHead className="h-12 w-[80px] text-center font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index} className="border-b last:border-0">
              <TableCell className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-20 shrink-0 rounded-md" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-[200px]" />

                    <Skeleton className="h-3 w-[260px]" />
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Skeleton className="h-6 w-[86px] rounded-md" />
              </TableCell>

              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[60px]" />

                  <Skeleton className="h-3 w-[48px]" />
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[56px]" />

                  <Skeleton className="h-3 w-[76px]" />
                </div>
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-[92px]" />
              </TableCell>

              <TableCell className="text-center">
                <Skeleton className="ml-auto h-9 w-9 rounded-lg" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

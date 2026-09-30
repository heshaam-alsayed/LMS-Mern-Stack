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

interface OrganizationStudentsTableSkeletonProps {
  rows?: number;
}

export default function OrganizationStudentsTableSkeleton({
  rows = 8,
}: OrganizationStudentsTableSkeletonProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[880px]">
        <TableHeader>
          <TableRow className="border-b bg-muted/30 hover:bg-muted/30">
            <TableHead className="h-12 w-[320px] px-5 font-semibold">
              Student
            </TableHead>

            <TableHead className="h-12 font-semibold">Email</TableHead>

            <TableHead className="h-12 w-[120px] font-semibold">
              Status
            </TableHead>

            <TableHead className="h-12 font-semibold">
              Purchased Courses
            </TableHead>

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
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-[220px]" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-6 w-[64px] rounded-md" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-6 w-[40px] rounded-md" />
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

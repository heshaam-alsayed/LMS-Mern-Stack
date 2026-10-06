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
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow key={index}>

                <TableCell>
                  <div className="flex items-center gap-3">

                    <Skeleton className="h-12 w-20 shrink-0 rounded-md" />


                    <div className="flex min-w-0 flex-col gap-2">
                      <Skeleton className="h-4 w-[180px]" />

                      <Skeleton className="h-3 w-[130px]" />
                    </div>
                  </div>
                </TableCell>


                <TableCell>
                  <Skeleton className="h-6 w-[90px] rounded-full" />
                </TableCell>


                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[70px]" />

                    <Skeleton className="h-3 w-[55px]" />
                  </div>
                </TableCell>


                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[55px]" />

                    <Skeleton className="h-3 w-[110px]" />
                  </div>
                </TableCell>


                <TableCell>
                  <Skeleton className="h-4 w-[90px]" />
                </TableCell>


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

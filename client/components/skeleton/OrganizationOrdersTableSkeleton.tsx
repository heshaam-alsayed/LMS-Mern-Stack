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

interface OrganizationOrdersTableSkeletonProps {
  rows?: number;
}

export default function OrganizationOrdersTableSkeleton({
  rows = 8,
}: OrganizationOrdersTableSkeletonProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="border-b bg-muted/30 hover:bg-muted/30">
            <TableHead className="h-12 w-[320px] px-5 font-semibold">
              Course
            </TableHead>

            <TableHead className="h-12 font-semibold">Student</TableHead>

            <TableHead className="h-12 font-semibold">Amount</TableHead>

            <TableHead className="h-12 font-semibold">Payment</TableHead>

            <TableHead className="h-12 font-semibold">Created</TableHead>
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

                    <Skeleton className="h-3 w-[140px]" />
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[140px]" />

                    <Skeleton className="h-3 w-[180px]" />
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-[60px]" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-6 w-[86px] rounded-md" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-[92px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

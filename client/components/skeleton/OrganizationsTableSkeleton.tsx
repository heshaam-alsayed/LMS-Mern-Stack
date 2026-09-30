import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrganizationsTableSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-xl border bg-background">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[900px]">
          {/* ==================== HEADER ==================== */}
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">
                <Skeleton className="h-4 w-24" />
              </TableHead>

              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>

              <TableHead className="w-[260px]">
                <Skeleton className="h-4 w-16" />
              </TableHead>

              <TableHead>
                <Skeleton className="h-4 w-12" />
              </TableHead>

              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* ==================== BODY ==================== */}
          <TableBody>
            {Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index} className="bg-muted/40 hover:bg-muted/40">
                {/* ==================== ORGANIZATION ==================== */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />

                    {/* Name + Slug */}
                    <div className="min-w-0">
                      <Skeleton className="h-4 w-[150px]" />

                      <Skeleton className="mt-2 h-3 w-[110px]" />
                    </div>
                  </div>
                </TableCell>

                {/* ==================== DESCRIPTION ==================== */}
                <TableCell>
                  <Skeleton className="h-4 w-[260px]" />
                </TableCell>

                {/* ==================== INSTRUCTOR ==================== */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

                    {/* Name + Email */}
                    <div className="min-w-0">
                      <Skeleton className="h-4 w-[120px]" />

                      <Skeleton className="mt-2 h-3 w-[170px]" />
                    </div>
                  </div>
                </TableCell>

                {/* ==================== STATUS ==================== */}
                <TableCell>
                  <Skeleton className="h-6 w-[85px] rounded-full" />
                </TableCell>

                {/* ==================== CREATED ==================== */}
                <TableCell>
                  <Skeleton className="h-4 w-[90px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

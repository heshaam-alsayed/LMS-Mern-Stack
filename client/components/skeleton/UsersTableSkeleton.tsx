import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersTableSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-xl border bg-background">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[900px]">
          {/* ==================== HEADER ==================== */}
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[320px]">
                <Skeleton className="h-4 w-16" />
              </TableHead>

              <TableHead>
                <Skeleton className="h-4 w-12" />
              </TableHead>

              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>

              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>

              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>

              <TableHead className="w-[60px]">
                <Skeleton className="ml-auto h-4 w-4" />
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* ==================== BODY ==================== */}
          <TableBody>
            {Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index} className="bg-muted/40 hover:bg-muted/40">
                {/* ==================== USER ==================== */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

                    {/* Name + Email */}
                    <div className="min-w-0">
                      <Skeleton className="h-4 w-[150px]" />

                      <Skeleton className="mt-2 h-3 w-[190px]" />
                    </div>
                  </div>
                </TableCell>

                {/* ==================== ROLE ==================== */}
                <TableCell>
                  <Skeleton className="h-6 w-[70px] rounded-full" />
                </TableCell>

                {/* ==================== VERIFICATION ==================== */}
                <TableCell>
                  <Skeleton className="h-6 w-[95px] rounded-full" />
                </TableCell>

                {/* ==================== COURSES ==================== */}
                <TableCell>
                  <Skeleton className="h-4 w-[70px]" />
                </TableCell>

                {/* ==================== CREATED ==================== */}
                <TableCell>
                  <Skeleton className="h-4 w-[90px]" />
                </TableCell>

                {/* ==================== ACTIONS ==================== */}
                <TableCell>
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

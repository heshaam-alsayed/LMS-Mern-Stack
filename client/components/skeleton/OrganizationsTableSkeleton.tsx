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
        <Table className="min-w-[820px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[240px]">
                <Skeleton className="h-4 w-24" />
              </TableHead>

              <TableHead className="w-[220px]">
                <Skeleton className="h-4 w-16" />
              </TableHead>

              <TableHead className="w-[70px]">
                <Skeleton className="h-4 w-12" />
              </TableHead>

              <TableHead>
                <Skeleton className="h-4 w-12" />
              </TableHead>

              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index} className="bg-muted/40 hover:bg-muted/40">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />

                    <div className="min-w-0">
                      <Skeleton className="h-4 w-[150px]" />

                      <Skeleton className="mt-2 h-3 w-[110px]" />
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-[260px]" />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

                    <div className="min-w-0">
                      <Skeleton className="h-4 w-[120px]" />

                      <Skeleton className="mt-2 h-3 w-[170px]" />
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Skeleton className="h-6 w-12 rounded-full" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-6 w-[85px] rounded-full" />
                </TableCell>

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

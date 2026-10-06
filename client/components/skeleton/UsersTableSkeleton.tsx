import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersTableSkeleton({
  isTeam = false,
}: {
  isTeam?: boolean;
}) {
  return (
    <div className="w-full overflow-hidden rounded-xl border bg-background">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[900px]">
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

              {!isTeam && (
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
              )}

              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>

              <TableHead className="w-[60px]">
                <Skeleton className="ml-auto h-4 w-4" />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index} className="bg-muted/40 hover:bg-muted/40">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

                    <div className="min-w-0">
                      <Skeleton className="h-4 w-[150px]" />

                      <Skeleton className="mt-2 h-3 w-[190px]" />
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Skeleton className="h-6 w-[70px] rounded-full" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-6 w-[95px] rounded-full" />
                </TableCell>

                {!isTeam && (
                  <TableCell>
                    <Skeleton className="h-4 w-[70px]" />
                  </TableCell>
                )}

                <TableCell>
                  <Skeleton className="h-4 w-[90px]" />
                </TableCell>

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

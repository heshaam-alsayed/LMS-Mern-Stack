"use client";

import Link from "next/link";
import { AlertCircle, TrendingUp, Users } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  OrganizationStudent,
  OrganizationStudentStatus,
} from "@/types/organization.type";

import OrganizationStudentsTableSkeleton from "@/components/skeleton/OrganizationStudentsTableSkeleton";

const STATUS_STYLES: Record<OrganizationStudentStatus, string> = {
  active:
    "rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium capitalize text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400",
  pending:
    "rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium capitalize text-amber-600 hover:bg-amber-500/10 dark:text-amber-400",
  suspended:
    "rounded-md bg-rose-500/10 px-2.5 py-1 text-xs font-medium capitalize text-rose-600 hover:bg-rose-500/10 dark:text-rose-400",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

interface OrganizationStudentsTableProps {
  students: OrganizationStudent[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function OrganizationStudentsTable({
  students,
  isLoading = false,
  error = null,
}: OrganizationStudentsTableProps) {
  if (isLoading) {
    return <OrganizationStudentsTableSkeleton />;
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[920px]">
        <TableHeader>
          <TableRow className="border-b bg-muted/30 hover:bg-muted/30">
            <TableHead className="h-12 w-[280px] px-5 font-semibold">
              Student
            </TableHead>

            <TableHead className="h-12 w-[280px] font-semibold">
              Email
            </TableHead>

            <TableHead className="h-12 w-[120px] font-semibold">
              Status
            </TableHead>

            <TableHead className="h-12 w-[160px] font-semibold">
              Purchased Courses
            </TableHead>

            <TableHead className="h-12 w-[150px] text-center font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {error ? (
            <TableRow>
              <TableCell colSpan={5} className="h-64">
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">
                      Failed to load students
                    </p>

                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                      {error.message ||
                        "Something went wrong while loading your students."}
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : students.length > 0 ? (
            students.map((student) => (
              <TableRow
                key={student._id}
                className="group border-b last:border-0 hover:bg-muted/30">
                <TableCell className="w-[280px] px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      {student.avatar?.url ? (
                        <AvatarImage
                          src={student.avatar.url}
                          alt={student.name}
                        />
                      ) : null}

                      <AvatarFallback className="text-xs">
                        {getInitials(student.name || "?")}
                      </AvatarFallback>
                    </Avatar>

                    <p className="min-w-0 truncate font-medium text-foreground">
                      {student.name}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="w-[280px]">
                  <div className="flex min-w-0 items-center">
                    <span className="truncate text-sm text-muted-foreground">
                      {student.email}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="w-[120px]">
                  <Badge
                    variant="secondary"
                    className={STATUS_STYLES[student.status]}>
                    {student.status}
                  </Badge>
                </TableCell>

                <TableCell className="w-[160px]">
                  <Badge
                    variant="secondary"
                    className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10">
                    {student.purchasedCount}
                  </Badge>
                </TableCell>

                <TableCell className="w-[150px] text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-lg">
                    <Link
                      href={`/instructor/organization-students/${student._id}`}>
                      <TrendingUp className="mr-1.5 h-4 w-4 text-muted-foreground" />

                      <span>View progress</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-48">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <p className="font-medium text-foreground">
                    No students found
                  </p>

                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Try adjusting your filters, or wait until a student enrolls
                    in one of your courses.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

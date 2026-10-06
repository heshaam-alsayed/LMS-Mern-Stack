"use client";

import Image from "next/image";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Building2,
  Eye,
  MoreHorizontal,
  Pencil,
  ShoppingCart,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Organization } from "@/types/organization.type";

import OrganizationsTableSkeleton from "@/components/skeleton/OrganizationsTableSkeleton";

interface OrganizationsTableProps {
  organizations: Organization[];
  isLoading?: boolean;
  error?: Error | null;
  onClickEdit?: (organization: Organization) => void;
  onClickDelete?: (organization: Organization) => void;
  onClickViewInstructor?: (organization: Organization) => void;
}

const STATUS_VARIANTS: Record<
  Organization["status"],
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className:
      "bg-green-500/10 text-green-600 hover:bg-green-500/10 dark:text-green-400",
  },
  suspended: {
    label: "Suspended",
    className: "bg-destructive/10 text-destructive hover:bg-destructive/10",
  },
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function OrganizationsTable({
  organizations,
  isLoading = false,
  error = null,
  onClickEdit,
  onClickDelete,
  onClickViewInstructor,
}: OrganizationsTableProps) {
  const router = useRouter();

  if (isLoading) {
    return <OrganizationsTableSkeleton />;
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border bg-background">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[820px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[240px]">Organization</TableHead>

              <TableHead className="w-[220px]">Instructor</TableHead>

              <TableHead className="w-[70px]">Courses</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Joined</TableHead>

              <TableHead className="w-[50px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                      <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>

                    <div>
                      <p className="font-semibold text-foreground">
                        Failed to load organizations
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {error.message ||
                          "Something went wrong while loading organizations."}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : organizations.length > 0 ? (
              organizations.map((organization) => {
                const statusConfig = STATUS_VARIANTS[organization.status];

                return (
                  <TableRow
                    key={organization._id}
                    className="bg-muted/40 transition-colors hover:bg-muted/80">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Building2 className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate font-medium text-foreground">
                            {organization.name}
                          </p>

                          <p className="max-w-[220px] truncate text-xs text-muted-foreground">
                            /{organization.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border bg-muted">
                          {organization.instructor?.avatar?.url ? (
                            <Image
                              src={organization.instructor.avatar.url}
                              alt={organization.instructor.name}
                              fill
                              className="object-cover"
                              sizes="36px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                              {organization.instructor?.name
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[180px] truncate font-medium text-foreground">
                            {organization.instructor?.name}
                          </p>

                          <p className="max-w-[180px] truncate text-xs text-muted-foreground">
                            {organization.instructor?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex w-fit items-center gap-2 rounded-full bg-muted px-2.5 py-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />

                        <span className="text-sm font-medium text-foreground">
                          {organization.coursesCount ?? 0}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusConfig.className}>
                        {statusConfig.label}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(organization.createdAt)}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />

                            <span className="sr-only">
                              Open organization actions
                            </span>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          sideOffset={6}
                          className="w-55 rounded-lg border bg-popover p-1 shadow-md">
                          <DropdownMenuItem
                            className="h-9 cursor-pointer gap-2 rounded-md px-2 text-sm"
                            onClick={() =>
                              router.push(
                                `/admin/organizations/${organization._id}`,
                              )
                            }>
                            <Eye className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span>View Details</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="h-9 cursor-pointer gap-2 rounded-md px-2 text-sm"
                            onClick={() =>
                              router.push(
                                `/admin/organizations/${organization._id}/courses-analytics`,
                              )
                            }>
                            <BarChart3 className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span>Courses Analytics</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="h-9 cursor-pointer gap-2 rounded-md px-2 text-sm"
                            onClick={() =>
                              router.push(
                                `/admin/organizations/${organization._id}/orders-analytics`,
                              )
                            }>
                            <ShoppingCart className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span>Orders Analytics</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="h-9 cursor-pointer gap-2 rounded-md px-2 text-sm"
                            onClick={() =>
                              onClickViewInstructor?.(organization)
                            }>
                            <UserRound className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span>View Instructor</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="h-9 cursor-pointer gap-2 rounded-md px-2 text-sm"
                            onClick={() => onClickEdit?.(organization)}>
                            <Pencil className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span>Edit</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="my-1" />

                          <DropdownMenuItem
                            className="h-9 cursor-pointer gap-2 rounded-md px-2 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onClick={() => onClickDelete?.(organization)}>
                            <Trash2 className="h-4 w-4 shrink-0" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Building2 className="mb-1 h-8 w-8 text-muted-foreground/50" />

                    <p className="font-medium">No organizations found</p>

                    <p className="text-sm text-muted-foreground">
                      There are no organizations to display.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

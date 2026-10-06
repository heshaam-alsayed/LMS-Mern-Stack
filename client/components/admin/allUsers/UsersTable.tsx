"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";

import { SelectedMember, User } from "@/types/user.type";
import UsersTableSkeleton from "@/components/skeleton/UsersTableSkeleton";
import { timeAgo } from "@/lib/utils";

interface UsersTableProps {
  users: User[];
  isLoading?: boolean;
  error?: Error | null;
  isTeam?: boolean;
  onClickEdit: (editingData: any) => void;
  onClickDelete: (selectedMember: SelectedMember) => void;
}

export default function UsersTable({
  users,
  isLoading = false,
  error = null,
  isTeam = false,
  onClickEdit,
  onClickDelete,
}: UsersTableProps) {
  const columnCount = isTeam ? 5 : 6;

  if (isLoading) {
    return <UsersTableSkeleton isTeam={isTeam} />;
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border bg-background shadow-sm">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="border-b bg-muted/30 hover:bg-muted/30">
              <TableHead className="h-12 w-[320px] px-5 font-semibold">
                User
              </TableHead>

              <TableHead className="h-12 font-semibold">Role</TableHead>

              <TableHead className="h-12 font-semibold">Verification</TableHead>

              {!isTeam && (
                <TableHead className="h-12 font-semibold">
                  Purchased Courses
                </TableHead>
              )}

              <TableHead className="h-12 font-semibold">Joined</TableHead>

              <TableHead className="h-12 w-[80px] text-center font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-64">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                      <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>

                    <div>
                      <p className="font-semibold text-foreground">
                        Failed to load users
                      </p>

                      <p className="mt-1 max-w-md text-sm text-muted-foreground">
                        {error.message ||
                          "Something went wrong while loading users."}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow
                  key={user._id}
                  className="group border-b last:border-0 hover:bg-muted/30">
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border bg-muted">
                        {user.avatar?.url ? (
                          <Image
                            src={user.avatar.url}
                            alt={user.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-sm font-semibold text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[220px] truncate font-medium text-foreground">
                          {user.name}
                        </p>

                        <p className="mt-0.5 max-w-[220px] truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="rounded-md px-2.5 py-1 text-xs font-medium capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {user.isVerified ? (
                      <Badge
                        variant="secondary"
                        className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400">
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 hover:bg-amber-500/10 dark:text-amber-400">
                        Not Verified
                      </Badge>
                    )}
                  </TableCell>

                  {!isTeam && (
                    <TableCell>
                      {user.role === "user" ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground">
                            {user.courses?.length ?? 0}
                          </span>

                          <span className="text-xs text-muted-foreground">
                            courses
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          —
                        </span>
                      )}
                    </TableCell>
                  )}

                  <TableCell>
                    <span className="whitespace-nowrap text-sm text-muted-foreground">
                      {timeAgo(user.createdAt)}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    {user.role === "user" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />

                            <span className="sr-only">
                              Open actions for {user.name}
                            </span>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          sideOffset={6}
                          className="w-44">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/users/operation-user/${user._id}`}
                              className="cursor-pointer">
                              <Eye className="mr-2.5 h-4 w-4 text-muted-foreground" />
                              <span>View user</span>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onClickEdit(user)}>
                            <Pencil className="mr-2.5 h-4 w-4 text-muted-foreground" />
                            <span>Edit user</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={() =>
                              onClickDelete({
                                _id: user._id,
                                name: user.name,
                                email: user.email,
                              })
                            }>
                            <Trash2 className="mr-2.5 h-4 w-4" />
                            <span>Delete user</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // EMPTY
              <TableRow>
                <TableCell colSpan={columnCount} className="h-48">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <p className="font-medium text-foreground">
                      No users found
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      There are no users to display.
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

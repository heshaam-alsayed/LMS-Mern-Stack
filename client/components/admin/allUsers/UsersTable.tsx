"use client";

import Image from "next/image";
import { Eye, MoreHorizontal, Pencil, Trash2, AlertCircle } from "lucide-react";

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

import { EditingMember, SelectedMember, User } from "@/types/user.type";
import UsersTableSkeleton from "@/components/skeleton/UsersTableSkeleton";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

interface UsersTableProps {
  users: User[];
  isLoading?: boolean;
  error?: Error | null;
  onClickEdit: (editingData: any) => void;
  onClickDelete: (selectedMember: SelectedMember) => void;
}

export default function UsersTable({
  users,
  isLoading = false,
  error = null,
  onClickEdit,
  onClickDelete,
}: UsersTableProps) {
  if (isLoading) {
    return <UsersTableSkeleton />;
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border bg-background">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[900px]">
          {/* ==================== HEADER ==================== */}
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[320px]">User</TableHead>

              <TableHead>Role</TableHead>

              <TableHead>Verification</TableHead>

              <TableHead>Purchased Courses</TableHead>

              <TableHead>Joined</TableHead>

              <TableHead className="w-[60px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* ==================== BODY ==================== */}
          <TableBody>
            {/* ==================== ERROR ==================== */}
            {error ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                      <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>

                    <div>
                      <p className="font-semibold text-foreground">
                        Failed to load users
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {error.message ||
                          "Something went wrong while loading users."}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              /* ==================== USERS ==================== */
              users.map((user) => (
                <TableRow
                  key={user._id}
                  className="bg-muted/40 transition-colors hover:cursor-pointer hover:bg-muted/80">
                  {/* ==================== USER ==================== */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
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
                          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Name + Email */}
                      <div className="min-w-0">
                        <p className="max-w-[220px] truncate font-medium text-foreground">
                          {user.name}
                        </p>

                        <p className="max-w-[220px] truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* ==================== ROLE ==================== */}
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "admin"
                          ? "default"
                          : user.role === "instructor"
                            ? "secondary"
                            : "outline"
                      }
                      className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>

                  {/* ==================== VERIFICATION ==================== */}
                  <TableCell>
                    {user.isVerified ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-600 hover:bg-green-500/10">
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/10">
                        Not Verified
                      </Badge>
                    )}
                  </TableCell>

                  {/* ==================== COURSES ==================== */}
                  <TableCell>
                    <span className="font-medium">
                      {user.courses?.length ?? 0}
                    </span>

                    <span className="ml-1 text-xs text-muted-foreground">
                      courses
                    </span>
                  </TableCell>

                  {/* ==================== CREATED ==================== */}
                  <TableCell>
                    <span className="whitespace-nowrap text-sm text-muted-foreground">
                      {timeAgo(user.createdAt)}
                    </span>
                  </TableCell>

                  {/* ==================== ACTIONS ==================== */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />

                          <span className="sr-only">Open actions</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        {/* View */}
                        <Link href={`/admin/users/operation-user/${user._id}`}>
                        <DropdownMenuItem
                          >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem></Link>

                        {/* Edit */}
                        <DropdownMenuItem onClick={() => onClickEdit(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Delete */}
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() =>
                            onClickDelete({
                              _id: user._id,
                              name: user.name,
                              email: user.email,
                            })
                          }>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              /* ==================== EMPTY ==================== */
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <p className="font-medium">No users found</p>

                    <p className="text-sm text-muted-foreground">
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

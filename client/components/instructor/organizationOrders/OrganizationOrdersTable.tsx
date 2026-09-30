"use client";

import Link from "next/link";
import { AlertCircle, BookOpen, Eye, ShoppingCart } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { OrganizationOrder } from "@/types/organization.type";

import OrganizationOrdersTableSkeleton from "@/components/skeleton/OrganizationOrdersTableSkeleton";

const PAYMENT_STYLES: Record<string, string> = {
  succeeded:
    "rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium capitalize text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400",
  pending:
    "rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium capitalize text-amber-600 hover:bg-amber-500/10 dark:text-amber-400",
  processing:
    "rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium capitalize text-amber-600 hover:bg-amber-500/10 dark:text-amber-400",
  failed:
    "rounded-md bg-rose-500/10 px-2.5 py-1 text-xs font-medium capitalize text-rose-600 hover:bg-rose-500/10 dark:text-rose-400",
  refunded:
    "rounded-md bg-slate-500/10 px-2.5 py-1 text-xs font-medium capitalize text-slate-600 hover:bg-slate-500/10 dark:text-slate-400",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

interface OrganizationOrdersTableProps {
  orders: OrganizationOrder[];
  isLoading?: boolean;
  error?: Error | null;
  onViewDetails?: (order: OrganizationOrder) => void;
}

export default function OrganizationOrdersTable({
  orders,
  isLoading = false,
  error = null,
  onViewDetails,
}: OrganizationOrdersTableProps) {
  if (isLoading) {
    return <OrganizationOrdersTableSkeleton />;
  }

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

            <TableHead className="h-12 text-right font-semibold">
              Actions
            </TableHead>
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
                      Failed to load orders
                    </p>

                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                      {error.message ||
                        "Something went wrong while loading your orders."}
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : orders.length > 0 ? (
            orders.map((order) => {
              const paymentStatus = order.paymentInfo?.status || "";

              return (
                <TableRow
                  key={order._id}
                  className="group border-b last:border-0 hover:bg-muted/30">
                  <TableCell className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border bg-primary/10">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>

                      <div className="min-w-0">
                        <Link
                          href={`/course/${order.course?._id}`}
                          className="block max-w-[240px] truncate font-medium text-foreground hover:text-primary">
                          {order.course?.name}
                        </Link>

                        <p className="mt-0.5 max-w-[240px] truncate text-xs text-muted-foreground">
                          {order.course?.category?.title || "Course"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        {order.user?.avatar?.url ? (
                          <AvatarImage
                            src={order.user.avatar.url}
                            alt={order.user.name}
                          />
                        ) : null}

                        <AvatarFallback className="text-xs">
                          {getInitials(order.user?.name || "?")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate font-medium text-foreground">
                          {order.user?.name}
                        </p>

                        <p className="max-w-[180px] truncate text-xs text-muted-foreground">
                          {order.user?.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="whitespace-nowrap font-semibold text-foreground">
                      ${order.price.toLocaleString()}
                    </span>
                  </TableCell>

                  <TableCell>
                    {paymentStatus ? (
                      <Badge
                        variant="secondary"
                        className={
                          PAYMENT_STYLES[paymentStatus.toLowerCase()] ?? ""
                        }>
                        {paymentStatus}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => onViewDetails?.(order)}>
                      <Eye className="h-3.5 w-3.5" />
                      View details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-48">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted">
                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <p className="font-medium text-foreground">No orders found</p>

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

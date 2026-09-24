
"use client";

import {
  AlertCircle,
  ArrowRight,
  Clock,
  CreditCard,
  FileText,
  Receipt,
} from "lucide-react";
import Link from "next/link";

import TopCoursesSellingSkeleton from "@/components/skeleton/TopCoursesSellingSkeleton";

type User = {
  _id: string;
  name: string;
  email: string;
};

type Course = {
  _id: string;
  name: string;
  price: number;
};

type Order = {
  _id: string;
  user: User;
  course: Course;
  price: number;
  createdAt: string;
};

type Props = {
  orders?: Order[];
  isLoading: boolean;
  isError: boolean;
  error?: string | null;
};

export default function RecentTransactions({
  orders = [],
  isLoading,
  isError,
  error,
}: Props) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Receipt className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">
              Recent Transactions
            </h3>

            <p className="text-xs text-muted-foreground">
              Latest course purchases
            </p>
          </div>
        </div>

        <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="flex-1">
        {isLoading ? (
          <TopCoursesSellingSkeleton />
        ) : isError ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <AlertCircle className="h-5 w-5" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-foreground">
              Failed to load transactions
            </h3>

            <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
              {error ||
                "Something went wrong while fetching transactions."}
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Receipt className="h-5 w-5" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-foreground">
              No transactions yet
            </h3>

            <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
              Recent course purchases will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => {
              const createdAt = new Date(order.createdAt);

              return (
                <div
                  key={order._id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  {/* Transaction Icon */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </div>

                  {/* User + Course */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {order.user?.name ?? "Unknown user"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {order.course?.name ?? "Unknown course"}
                    </p>

                    <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />

                      <span>
                        {createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-foreground">
                      ${order.price.toLocaleString()}
                    </p>

                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Paid
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isLoading && !isError && orders.length > 0 && (
        <div className="mt-auto shrink-0 border-t border-border px-4 py-3">
          <Link
            href="/admin/invoices"
            className="group flex w-full items-center justify-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <FileText className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />

            <span>View all invoices</span>

            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

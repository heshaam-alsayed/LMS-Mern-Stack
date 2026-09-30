"use client";

import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Hash,
  ReceiptText,
  ShoppingBag,
} from "lucide-react";

import { IAdminUserOrder } from "@/types/operation.type";

interface PurchaseHistoryProps {
  orders: IAdminUserOrder[];
}

export default function PurchaseHistory({
  orders,
}: PurchaseHistoryProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPaymentMethod = (method?: string) => {
    if (!method) return "N/A";

    return method
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (!orders?.length) {
    return (
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
            <ReceiptText className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Purchase History
            </h2>

            <p className="text-sm text-muted-foreground">
              Complete history of the user&apos;s course purchases and payments
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted/40 text-muted-foreground">
            <ShoppingBag className="h-6 w-6" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-foreground">
            No Purchase History
          </h3>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            This user has not made any course purchases yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
          <ReceiptText className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Purchase History
          </h2>

          <p className="text-sm text-muted-foreground">
            Complete history of the user&apos;s course purchases and payments
          </p>
        </div>
      </div>

      {/* Orders */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        {/* Desktop Header */}
        <div className="hidden border-b border-border/60 bg-muted/30 px-5 py-3 lg:grid lg:grid-cols-[1.8fr_1fr_1fr_1.2fr_1.2fr] lg:items-center lg:gap-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Course
          </p>

          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Amount
          </p>

          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Status
          </p>

          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Payment
          </p>

          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Date
          </p>
        </div>

        <div className="divide-y divide-border/60">
          {orders.map((order) => {
            const payment = order.paymentInfo;

            return (
              <div
                key={order._id}
                className="group p-4 transition-colors duration-200 hover:bg-muted/20 sm:p-5"
              >
                {/* Desktop */}
                <div className="hidden lg:grid lg:grid-cols-[1.8fr_1fr_1fr_1.2fr_1.2fr] lg:items-center lg:gap-4">
                  {/* Course */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                      {order.course.thumbnail?.url ? (
                        <img
                          src={order.course.thumbnail.url}
                          alt={order.course.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold text-foreground">
                        {order.course.name}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Hash className="h-3 w-3" />
                        <span className="truncate">{order._id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      ${order.price.toLocaleString()}
                    </p>

                    <p className="mt-0.5 text-xs uppercase text-muted-foreground">
                      {payment?.currency ?? "USD"}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {payment?.status ?? "Paid"}
                    </span>
                  </div>

                  {/* Payment */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground" />

                      <span className="truncate text-sm font-medium text-foreground">
                        {formatPaymentMethod(payment?.payment_method)}
                      </span>
                    </div>

                    {payment?.id && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {payment.id}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />

                      <span className="text-sm font-medium text-foreground">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile / Tablet */}
                <div className="lg:hidden">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-muted sm:h-24 sm:w-36">
                      {order.course.thumbnail?.url ? (
                        <img
                          src={order.course.thumbnail.url}
                          alt={order.course.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    {/* Main Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-sm font-semibold text-foreground sm:text-base">
                          {order.course.name}
                        </h3>

                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Paid
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(order.createdAt)}
                      </div>

                      <p className="mt-2 text-lg font-bold tracking-tight text-foreground">
                        ${order.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="mt-4 grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-muted/30 p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CreditCard className="h-4 w-4" />

                        <span className="text-xs font-medium">
                          Payment Method
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-medium text-foreground">
                        {formatPaymentMethod(payment?.payment_method)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/30 p-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Hash className="h-4 w-4" />

                        <span className="text-xs font-medium">
                          Transaction ID
                        </span>
                      </div>

                      <p className="mt-1 truncate text-sm font-medium text-foreground">
                        {payment?.id ?? "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Order ID */}
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <Hash className="h-4 w-4 shrink-0 text-muted-foreground" />

                      <span className="text-xs text-muted-foreground">
                        Order ID
                      </span>

                      <span className="truncate text-xs font-medium text-foreground">
                        {order._id}
                      </span>
                    </div>

                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
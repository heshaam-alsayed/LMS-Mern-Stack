"use client";

import Image from "next/image";
import { useState } from "react";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Copy,
  Mail,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ICourseOrder } from "@/types/operation.type";

interface RecentOrdersProps {
  orders: ICourseOrder[] | undefined;
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  if (!orders || orders.length === 0) {
    return (
      <section className="mt-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Recent purchases for this course.
          </p>
        </div>

        <Card className="border-border/60 bg-card shadow-sm">
          <CardContent className="flex min-h-[180px] flex-col items-center justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-muted/50">
              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="mt-3 text-sm font-semibold">No orders yet</p>

            <p className="mt-1 text-xs text-muted-foreground">
              There are no purchases for this course.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const recentOrders = orders.slice(0, 5);

  return (
    <section className="mt-6">
      {/* ==================== Header ==================== */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Recent Orders
          </h2>

          <Badge
            variant="secondary"
            className="rounded-full px-2 py-0.5 text-[11px]">
            {orders.length}
          </Badge>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Recent purchases for this course.
        </p>
      </div>

      {/* ==================== Orders ==================== */}
      <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
        <CardContent className="p-0">
          {/* Desktop Header */}
          <div className="hidden grid-cols-[minmax(220px,1.5fr)_minmax(200px,1.3fr)_100px_110px_140px] items-center gap-4 border-b border-border/60 bg-muted/20 px-5 py-3 md:grid">
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              User
            </span>

            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Email
            </span>

            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Price
            </span>

            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Payment
            </span>

            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Date
            </span>
          </div>

          {/* Orders */}
          <div className="divide-y divide-border/60">
            {recentOrders.map((order) => {
              const user = order.user;

              const userName = user?.name ?? "Unknown User";

              const userEmail = user?.email ?? "No email";

              const userImage = user?.avatar?.url;

              return (
                <OrderRow
                  key={order._id}
                  order={order}
                  userName={userName}
                  userEmail={userEmail}
                  userImage={userImage}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

/* ============================================================
   Order Row
============================================================ */

interface OrderRowProps {
  order: ICourseOrder;
  userName: string;
  userEmail: string;
  userImage?: string;
}

function OrderRow({ order, userName, userEmail, userImage }: OrderRowProps) {
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleCopyUserId = async () => {
    if (!order.user?._id) return;

    try {
      await navigator.clipboard.writeText(order.user._id);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy user ID:", error);
    }
  };

  return (
    <div className="px-5 py-4 transition-colors hover:bg-muted/20">
      {/* ==================== Desktop ==================== */}
      <div className="hidden grid-cols-[minmax(220px,1.5fr)_minmax(200px,1.3fr)_100px_110px_140px] items-center gap-4 md:grid">
        {/* User */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-muted">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <UserRound className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {userName}
            </p>

            {/* User ID */}
            <div className="mt-0.5 flex items-center gap-1">
              <span className="max-w-[130px] truncate font-mono text-[10px] text-muted-foreground">
                {order.user?._id}
              </span>

              <button
                type="button"
                onClick={handleCopyUserId}
                aria-label="Copy user ID"
                title={copied ? "Copied" : "Copy user ID"}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="flex min-w-0 items-center gap-2">
          <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

          <span className="truncate text-sm text-muted-foreground">
            {userEmail}
          </span>
        </div>

        {/* Price */}
        <p className="text-sm font-semibold text-foreground">
          ${order.price.toLocaleString()}
        </p>

        {/* Payment */}
        <Badge
          variant="secondary"
          className="w-fit gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          Paid
        </Badge>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />

          <span>{formattedDate}</span>
        </div>
      </div>

      {/* ==================== Mobile ==================== */}
      <div className="space-y-4 md:hidden">
        {/* User */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-muted">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <UserRound className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {userName}
            </p>

            {/* User ID + Copy */}
            <div className="mt-0.5 flex items-center gap-1">
              <span className="max-w-[160px] truncate font-mono text-[10px] text-muted-foreground">
                {order.user?._id}
              </span>

              <button
                type="button"
                onClick={handleCopyUserId}
                aria-label="Copy user ID"
                title={copied ? "Copied" : "Copy user ID"}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>

            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-3 border-t border-border/60 pt-3">
          {/* Price */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Price
            </p>

            <p className="mt-1 text-sm font-semibold text-foreground">
              ${order.price.toLocaleString()}
            </p>
          </div>

          {/* Payment */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Payment
            </p>

            <Badge
              variant="secondary"
              className="mt-1 gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-2.5 w-2.5" />
              Paid
            </Badge>
          </div>

          {/* Date */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Date
            </p>

            <p className="mt-1 text-xs font-medium text-foreground">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

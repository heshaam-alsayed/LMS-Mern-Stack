"use client";

import Image from "next/image";
import { CalendarDays, CircleDollarSign, Mail, Tag } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Order } from "@/types/order.type";
import { useModalBehavior } from "@/customHooks/useModalBehavior";

type Props = {
  invoice: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function InvoiceDetailsModal({
  invoice,
  open,
  onOpenChange,
}: Props) {
  useModalBehavior({
    isOpen: open,
    onClose: () => onOpenChange(false),
  });

  if (!invoice) return null;

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  const createdAt = new Date(invoice.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  console.log(invoice)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        {/* HEADER */}
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center justify-between pr-6">
            <div>
              <DialogTitle className="text-base font-semibold">
                Order Details
              </DialogTitle>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Order #{invoice._id}
              </p>
            </div>

            <div className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
              <CircleDollarSign className="h-3.5 w-3.5" />
              {formatPrice(invoice.price)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* CUSTOMER + COURSE */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* CUSTOMER */}
            <div className="min-w-0">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Customer
              </p>

              <div className="flex min-w-0 items-center gap-2.5">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                  {invoice.user.avatar?.url ? (
                    <Image
                      src={invoice.user.avatar.url}
                      alt={invoice.user.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground">
                      {invoice.user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {invoice.user.name}
                  </p>

                  <div className="mt-0.5 flex min-w-0 items-center gap-1">
                    <Mail className="h-3 w-3 shrink-0 text-muted-foreground" />

                    <span className="truncate text-xs text-muted-foreground">
                      {invoice.user.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* COURSE */}
            <div className="min-w-0">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Course
              </p>

              <div className="flex min-w-0 items-center gap-2.5">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                  {invoice.course.thumbnail?.url ? (
                    <Image
                      src={invoice.course.thumbnail.url}
                      alt={invoice.course.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {invoice.course.name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {invoice.course.category?.title || "Uncategorized"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ORDER INFORMATION */}
          <div className="border-y border-border py-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {/* ORDER ID */}
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">Order ID</p>

                <p className="mt-0.5 truncate text-xs font-medium text-foreground">
                  {invoice._id}
                </p>
              </div>

              {/* CREATED */}
              <div>
                <p className="text-[11px] text-muted-foreground">Created</p>

                <div className="mt-0.5 flex items-center gap-1">
                  <CalendarDays className="h-3 w-3 text-muted-foreground" />

                  <p className="text-xs font-medium text-foreground">
                    {createdAt}
                  </p>
                </div>
              </div>

              {/* CATEGORY */}
              <div>
                <p className="text-[11px] text-muted-foreground">Category</p>

                <p className="mt-0.5 truncate text-xs font-medium text-foreground">
                  {invoice.course.category?.title || "Uncategorized"}
                </p>
              </div>
            </div>
          </div>

          {/* PRICING */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {/* COURSE PRICE */}
              <div>
                <p className="text-[11px] text-muted-foreground">
                  Course Price
                </p>

                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {formatPrice(invoice.course.price)}
                </p>
              </div>

              {/* ESTIMATED PRICE */}
              <div>
                <p className="text-[11px] text-muted-foreground">Estimated</p>

                <p className="mt-0.5 text-sm text-muted-foreground line-through">
                  {formatPrice(invoice.course.estimatePrice)}
                </p>
              </div>
            </div>

            {/* AMOUNT PAID */}
            <div className="text-right">
              <p className="text-[11px] font-medium text-muted-foreground">
                Amount Paid
              </p>

              <p className="mt-0.5 text-lg font-bold text-primary">
                {formatPrice(invoice.price)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

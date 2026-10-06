// ViewOrderDetailsModal tsx

"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useModalBehavior } from "@/customHooks/useModalBehavior";
import { OrganizationOrder } from "@/types/organization.type";

import { OrderCourseSection } from "./orderDetails/OrderCourseSection";
import { OrderStudentSection } from "./orderDetails/OrderStudentSection";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  order: OrganizationOrder | null;
};

export default function ViewOrderDetailsModal({
  isOpen,
  onClose,
  order,
}: Props) {
  useModalBehavior({
    isOpen,
    onClose,
  });

  if (!isOpen || !order) {
    return null;
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}>
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl">
        <header className="flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarDays className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-foreground sm:text-base">
                Order Details
              </h2>

              <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                {orderDate}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="px-4 py-5 sm:px-6 sm:py-6">
            <OrderStudentSection user={order.user} />
            <div className="my-7 border-t border-border/60" />

            <OrderCourseSection
              course={order.course}
              orderAmount={order.price}
            />
          </div>
        </main>

        <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-border/60 px-4 py-3 sm:px-6">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>

          <Button asChild size="sm">
            <Link href={`/course/${order.course?._id}`}>
              View Course
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </footer>
      </div>
    </div>
  );
}

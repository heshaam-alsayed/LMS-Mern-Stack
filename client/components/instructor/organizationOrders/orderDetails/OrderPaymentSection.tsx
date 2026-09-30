"use client";

import { CalendarDays, CreditCard, Hash, Receipt } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { OrganizationOrder } from "@/types/organization.type";

import {
  DetailRow,
  formatCurrency,
  formatDate,
  PAYMENT_STYLES,
  SectionCard,
} from "./orderDetailsShared";

type Props = {
  order: OrganizationOrder;
};

export function OrderPaymentSection({ order }: Props) {
  const paymentStatus = order.paymentInfo?.status;

  return (
    <SectionCard icon={<CreditCard className="h-4 w-4" />} title="Payment">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/30 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-muted-foreground">
            <Receipt className="h-4 w-4" />
          </span>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Amount paid
            </p>

            <p className="text-lg font-semibold tracking-tight text-foreground">
              {formatCurrency(order.price)}
            </p>
          </div>
        </div>

        {paymentStatus ? (
          <Badge
            variant="secondary"
            className={PAYMENT_STYLES[paymentStatus.toLowerCase()] ?? ""}>
            {paymentStatus}
          </Badge>
        ) : null}
      </div>

      <div className="mt-4 divide-y divide-border/60">
        <DetailRow
          label="Payment method"
          value={order.paymentInfo?.payment_method || undefined}
        />
        <DetailRow label="Transaction ID" value={order.paymentInfo?.id} mono />
        <DetailRow
          label="Ordered on"
          value={
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              {formatDate(order.createdAt)}
            </span>
          }
        />
        <DetailRow label="Order ID" value={order._id} mono />
      </div>
    </SectionCard>
  );
}

export function OrderReferenceCard({ order }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Hash className="h-3.5 w-3.5" />
        {order._id}
      </span>

      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5" />
        {formatDate(order.createdAt)}
      </span>
    </div>
  );
}

"use client";

import Image from "next/image";
import { Eye, Receipt } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Order } from "@/types/order.type";
import { fakeInvoices } from "@/lib/fakeData/FakeInVoices";

type Props = {
  orders: Order[];
  onView: (order: Order) => void;
};

export default function InvoicesTable({ orders = [], onView }: Props) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Receipt className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Invoices</h2>

            <p className="text-xs text-muted-foreground">
              View and manage course purchase invoices
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      {fakeInvoices.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  User
                </th>

                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Course
                </th>

                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Amount
                </th>

                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Created
                </th>

                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {fakeInvoices.map((order) => (
                <tr
                  key={order._id}
                  className="transition-colors hover:bg-muted/20">
                  {/* User */}
                  <td className="px-5 py-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {order.user?.name ?? "Unknown user"}
                      </p>

                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {order.user?._id ?? "N/A"}
                      </p>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <p className="max-w-[280px] truncate text-sm font-medium text-foreground">
                        {order.course?.name ?? "Unknown course"}
                      </p>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-foreground">
                      ${order.price.toLocaleString()}
                    </p>

                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Order amount
                    </p>
                  </td>

                  {/* Created */}
                  <td className="px-5 py-4">
                    <p
                      className="text-sm text-muted-foreground"
                      title={new Date(order.createdAt).toLocaleString()}>
                      {formatDistanceToNow(new Date(order.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onView(order)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
                      aria-label={`View invoice ${order._id}`}>
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Receipt className="h-5 w-5" />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-foreground">
            No invoices found
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Purchase invoices will appear here.
          </p>
        </div>
      )}
    </div>
  );
}

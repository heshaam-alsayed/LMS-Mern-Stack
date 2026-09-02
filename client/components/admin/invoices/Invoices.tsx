"use client";

import { getAllOrdersInvoices } from "@/lib/api/getOrders";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import InvoicesError from "./InvoicesError";
import InvoicesFilters from "./InvoicesFilters";
import InvoicesTable from "./InvoicesTable";
import InvoicesSkeleton from "@/components/skeleton/InvoicesSkeleton";
import { Order } from "@/types/order.type";
import InvoiceDetailsModal from "@/components/modal/InvoiceDetailsModal";

export default function Invoices() {
  const searchParams = useSearchParams();

  const [viewInvoice, setViewInvoice] = useState<Order | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const query = searchParams.toString();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["invoices-orders", query],
    queryFn: () => getAllOrdersInvoices(false, query),
    staleTime: 5 * 60 * 1000,
  });

  const handleOnView = (invoice: Order) => {
    setViewInvoice(invoice);
    setOpenModal(true);
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <InvoicesFilters
        pagination={
          data?.pagination ?? {
            currentPage: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          }
        }
      />

      {/* Initial Loading */}
      {isLoading && <InvoicesSkeleton />}

      {/* Error */}
      {!isLoading && isError && (
        <InvoicesError
          message={
            error instanceof Error
              ? error.message
              : "Something went wrong while loading invoices."
          }
          onRetry={() => refetch()}
        />
      )}

      {/* Table */}
      {!isLoading && !isError && data && (
        <InvoicesTable orders={data.orders || []} onView={handleOnView} />
      )}

      <InvoiceDetailsModal invoice={viewInvoice} onOpenChange={setOpenModal} open={openModal} />
    </div>
  );
}

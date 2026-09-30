"use client";

import { getAllOrdersInvoices } from "@/lib/api/getOrders";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import InvoicesError from "./InvoicesError";
import InvoicesFilters from "./InvoicesFilters";
import InvoicesTable from "./InvoicesTable";
import InvoicesSkeleton from "@/components/skeleton/InvoicesSkeleton";
import { Order } from "@/types/order.type";
import InvoiceDetailsModal from "@/components/modal/InvoiceDetailsModal";
import Pagination from "@/components/shared/Pagination";

export default function Invoices() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewInvoice, setViewInvoice] = useState<Order | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const query = searchParams.toString();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["invoices-orders", query],
    queryFn: () => getAllOrdersInvoices(false, query),
    staleTime: 5 * 60 * 1000,
  });
  const pagination = data?.pagination;

  const handleOnView = (invoice: Order) => {
    setViewInvoice(invoice);
    setOpenModal(true);
  };

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Reset page when changing search, sort, or limit
    if (key !== "page") {
      params.delete("page");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleNext = () => {
    if (!pagination?.hasNextPage) return;

    updateQuery("page", String(pagination.currentPage + 1));
  };

  const handlePrevious = () => {
    if (!pagination?.hasPreviousPage) return;

    updateQuery("page", String(pagination?.currentPage - 1));
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <InvoicesFilters
        updateQuery={updateQuery}
        paginationLimit={pagination?.limit ?? 0}
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

      {/* Pagination */}
      {(pagination?.totalPages ?? 0) > 1 && (
        <div className="flex w-full items-center justify-center border-t border-border pt-4">
          <Pagination
            pagination={pagination}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      )}
      <InvoiceDetailsModal
        invoice={viewInvoice}
        onOpenChange={setOpenModal}
        open={openModal}
      />
    </div>
  );
}

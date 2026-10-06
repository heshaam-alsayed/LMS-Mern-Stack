import { Suspense } from "react";

import Invoices from "@/components/admin/invoices/Invoices";
import InvoicesSkeleton from "@/components/skeleton/InvoicesSkeleton";

export default function page() {
  // the invoice filters read the query string
  return (
    <Suspense fallback={<InvoicesSkeleton />}>
      <Invoices />
    </Suspense>
  );
}
"use client";

import { Suspense } from "react";

import AllUsers from "@/components/admin/allUsers/AllUsers";
import UsersTableSkeleton from "@/components/skeleton/UsersTableSkeleton";

export default function page() {
  // AllUsers reads the filter query string search page sort role
  return (
    <Suspense fallback={<UsersTableSkeleton />}>
      <AllUsers />
    </Suspense>
  );
}
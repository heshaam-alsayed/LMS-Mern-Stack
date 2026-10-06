"use client";

import { Suspense } from "react";

import AllUsers from "@/components/admin/allUsers/AllUsers";
import UsersTableSkeleton from "@/components/skeleton/UsersTableSkeleton";

export default function page() {
  // same table component as admin users same query string filters
  return (
    <Suspense fallback={<UsersTableSkeleton />}>
      <AllUsers />
    </Suspense>
  );
}
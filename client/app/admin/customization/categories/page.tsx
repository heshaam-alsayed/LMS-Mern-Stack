import { Suspense } from "react";

import EditCategory from "@/components/admin/customization/category/EditCategory";
import CategoriesSkeleton from "@/components/skeleton/CategoriesSkeleton";

export default function page() {
  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <EditCategory />
    </Suspense>
  );
}
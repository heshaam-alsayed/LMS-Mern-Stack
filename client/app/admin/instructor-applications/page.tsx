import { Suspense } from "react";

import InstructorApplications from "@/components/admin/organizations/InstructorApplications";
import InstructorApplicationCardSkeleton from "@/components/skeleton/InstructorApplicationCardSkeleton";

export default function page() {
  // the application filters read the query string
  return (
    <Suspense fallback={<InstructorApplicationCardSkeleton />}>
      <InstructorApplications />
    </Suspense>
  );
}
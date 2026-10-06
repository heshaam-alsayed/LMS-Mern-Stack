import { Suspense } from "react";

import CoursesTableSkeleton from "@/components/skeleton/CoursesTableSkeleton";

import CoursesContent from "./CoursesContent";

export default function CoursesPage() {
  return (
    <Suspense fallback={<CoursesTableSkeleton />}>
      <CoursesContent />
    </Suspense>
  );
}

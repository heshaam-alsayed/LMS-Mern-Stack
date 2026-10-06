import { Suspense } from "react";

import OrganizationCoursesAnalytics from "@/components/admin/organizationDetails/coursesAnalytics/OrganizationCoursesAnalytics";
import CoursesAnalyticsSkeleton from "@/components/skeleton/CoursesAnalyticsSkeleton";

type Params = {
  id: string;
};

export default async function page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  // reads the year query param through useStatisticsYear
  return (
    <Suspense fallback={<CoursesAnalyticsSkeleton />}>
      <OrganizationCoursesAnalytics id={id} />
    </Suspense>
  );
}
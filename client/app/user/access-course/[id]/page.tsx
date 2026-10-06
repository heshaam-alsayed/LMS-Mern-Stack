import { Suspense } from "react";

import EnrolledContentCourse from "@/components/user/ContentCourse/EnrolledContentCourse";
import EnrolledContentCourseSkeleton from "@/components/skeleton/EnrolledContentCourseSkeleton";
import Header from "@/components/shared/Header";

type Params = {
  id: string;
};

export default async function page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  // the player restores activeVideo from the query string on open
  return (
    <div className="lg:container lg:mx-auto">
      <Header />

      <Suspense fallback={<EnrolledContentCourseSkeleton />}>
        <EnrolledContentCourse id={id} />
      </Suspense>
    </div>
  );
}
import CourseOperation from "@/components/admin/courseOperation/CourseOperation";
import React from "react";

type Params = {
  id: string;
};
export default async function page({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  return (
    <div>
      <CourseOperation courseId={id}/>
    </div>
  );
}

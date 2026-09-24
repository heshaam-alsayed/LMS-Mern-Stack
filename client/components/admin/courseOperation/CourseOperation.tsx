"use client";
import { getOperationCourse } from "@/lib/api/getOperationCourse";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import CourseOverview from "./CourseOverview";
import CoursePerformance from "./CoursePerformance";
import RecentOrders from "./RecentOrders";

type Props = {
  courseId: string;
};
export default function CourseOperation({ courseId }: Props) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["get-operation-course", courseId],
    queryFn: () => getOperationCourse(courseId),
  });
  console.log(data);
  return (
    <div className="space-y-4">
      <CourseOverview course={data?.data?.course} />
      <CoursePerformance course={data?.data.course} orders={data?.data.orders} statistics={data?.data.statistics}/>
      <RecentOrders orders={data?.data.orders}/>
    </div>
  );
}

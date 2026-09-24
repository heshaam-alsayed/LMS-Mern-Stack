"use client";

import { getCourseDetails } from "@/lib/api/getCourseDetails";
import { useAppSelector } from "@/redux/hooks";
import { useQuery } from "@tanstack/react-query";

import CourseContent from "./CourseContent";
import CourseHero from "./CourseHero";
import CoursePurchase from "./CoursePurchased";
import { useState } from "react";
import CheckoutModal from "../modal/CheckoutSidebar";
import CheckoutSidebar from "../modal/CheckoutSidebar";
import CourseDetailSkeleton from "../skeleton/CourseDetailsSkeleton";
import ErrorStateCourseDetails from "./ErrorStateCourseDetails";

type Props = {
  id: string;
};

export default function CourseDetailS({ id }: Props) {
  const { user } = useAppSelector((state) => state.auth);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const {
    data,
    isLoading,
    isRefetching,
    isError = true,
    error,
    refetch,
  } = useQuery({
    queryKey: ["course-details", id],
    queryFn: () => getCourseDetails(id),
    staleTime: 60 * 60 * 1000,
  });

  if (isLoading || isRefetching) {
    return <CourseDetailSkeleton />;
  }

  if (isError || !data?.course) {
    return <ErrorStateCourseDetails refetch={refetch} error={error?.message} />;
  }

  const course = data.course;

  const isPurchased = user?.courses?.some((item) => item === id);

  const discountPercentage =
    course.estimatePrice > course.price
      ? Math.round(
          ((course.estimatePrice - course.price) / course.estimatePrice) * 100,
        )
      : 0;
  console.log(data);
  return (
    <main className="min-h-screen bg-background text-foreground">
      <CourseHero
        isPurchased={isPurchased}
        discountPercentage={discountPercentage}
        course={course}
        onBuyNow={() => setCheckoutOpen(true)}
      />

      <CoursePurchase
        course={course}
        isPurchased={isPurchased}
        discountPercentage={discountPercentage}
        onBuyNow={() => setCheckoutOpen(true)}
      />

      <CourseContent course={course} isPurchased={isPurchased} />
      <CheckoutSidebar
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        courseId={course?._id}
      />
    </main>
  );
}

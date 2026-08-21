"use client";

import { CourseData } from "@/types/course.type";
import CoursePlayer from "../coursePlayer/CoursePlayer";
import CoursePreviewPricing from "./CoursePreviewPricing";
import CourseDiscount from "./CourseDiscount";
import CourseFeatures from "./CourseFeatures";
import CourseOverview from "./CourseOverview";
import CourseBenefits from "./CourseBenefits";
import CoursePrerequisites from "./CoursePrerequisites";
import CourseDetails from "./CourseDetails";
import CourseActions from "./CourseActions";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: CourseData | null;
  onOpen: () => void;
};

export default function CoursePreview({
  active,
  setActive,
  courseData,
  onOpen,
}: Props) {
  const price = courseData?.price ?? 0;
  const estimatePrice = courseData?.estimatePrice ?? 0;

  const hasDiscount = estimatePrice > 0 && estimatePrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(((estimatePrice - price) / estimatePrice) * 100)
    : 0;

  return (
    <div className="mb-6 w-full">
      <div className="relative w-full">
        {/* Video */}
        <div className="w-full">
          <CoursePlayer
            videoUrl={courseData?.demoUrl}
            title={courseData?.name}
          />
        </div>

        {courseData && (
          <>
            <CoursePreviewPricing
              price={price}
              estimatePrice={estimatePrice}
              hasDiscount={hasDiscount}
              discountPercentage={discountPercentage}
            />

            <CourseDiscount />

            <CourseFeatures />

            <CourseOverview courseData={courseData} />

            <CourseBenefits courseData={courseData} />

            <CoursePrerequisites courseData={courseData} />

            <CourseDetails courseData={courseData} />

            <CourseActions
              active={active}
              setActive={setActive}
              onOpen={onOpen}
            />
          </>
        )}
      </div>
    </div>
  );
}

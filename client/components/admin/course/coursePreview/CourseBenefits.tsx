import { Check } from "lucide-react";
import { CourseData } from "@/types/course.type";

type Props = {
  courseData: CourseData;
};

export default function CourseBenefits({ courseData }: Props) {
  return (
    <div className="mt-6">
      <h1 className="text-lg font-bold text-foreground">
        What you&apos;ll learn from this course
      </h1>

      <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {courseData.benefits?.map((benefit, index) => (
          <div
            key={`${benefit.title}-${index}`}
            className="flex items-start gap-2.5"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

            <span className="text-sm text-muted-foreground">
              {benefit.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
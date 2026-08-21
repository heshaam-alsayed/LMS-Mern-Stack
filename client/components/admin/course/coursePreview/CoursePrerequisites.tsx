import { CircleAlert } from "lucide-react";
import { CourseData } from "@/types/course.type";

type Props = {
  courseData: CourseData;
};

export default function CoursePrerequisites({
  courseData,
}: Props) {
  return (
    <div className="mt-6">
      <h1 className="text-lg font-bold text-foreground">
        What you need to know before starting this course.
      </h1>

      <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {courseData.prerequisites?.map((prerequisite, index) => (
          <div
            key={`${prerequisite.title}-${index}`}
            className="flex items-start gap-2.5"
          >
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

            <span className="text-sm text-muted-foreground">
              {prerequisite.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
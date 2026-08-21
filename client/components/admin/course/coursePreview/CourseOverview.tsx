import { Star, Users } from "lucide-react";
import { CourseData } from "@/types/course.type";

type Props = {
  courseData: CourseData;
};

export default function CourseOverview({ courseData }: Props) {
  return (
    <div className="mt-5 space-y-3">
      {/* Course Name */}
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        {courseData.name}
      </h1>

      {/* Course Stats */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">4.8</span>

          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className="h-4 w-4 fill-amber-400 text-amber-400"
              />
            ))}
          </div>

          <span>(245 reviews)</span>
        </div>

        {/* Divider */}
        <span className="h-4 w-px bg-border" />

        {/* Students */}
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-muted-foreground" />

          <span>1,250 students</span>
        </div>
      </div>
    </div>
  );
}
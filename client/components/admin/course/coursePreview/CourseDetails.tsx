import { CourseData } from "@/types/course.type";

type Props = {
  courseData: CourseData;
};

export default function CourseDetails({ courseData }: Props) {
  return (
    <div className="mt-7">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Course Details
        </h2>

        <p className="mt-1.5 text-sm text-muted-foreground">
          Get an overview of the course content and difficulty level.
        </p>
      </div>

      {/* Details */}
      <div className="space-y-6">
        {/* Course Name */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Course
          </p>

          <h3 className="mt-1.5 text-base font-semibold leading-6 text-foreground">
            {courseData.name || "—"}
          </h3>
        </div>

        {/* Description */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Description
          </p>

          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-foreground/80">
            {courseData.description || "—"}
          </p>
        </div>

        {/* Level */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Difficulty Level
          </p>

          <p className="mt-1.5 text-sm font-semibold capitalize text-foreground">
            {courseData.level || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
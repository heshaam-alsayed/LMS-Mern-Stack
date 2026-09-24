import { BookOpen } from "lucide-react";

interface EnrolledCoursesHeaderProps {
  count: number;
}

export default function EnrolledCoursesHeader({
  count,
}: EnrolledCoursesHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />

          <span className="text-sm font-medium text-primary">
            My Learning
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Enrolled Courses
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Continue learning and track your progress.
        </p>
      </div>

      <div className="text-sm text-muted-foreground">
        {count} {count === 1 ? "course" : "courses"}
      </div>
    </div>
  );
}
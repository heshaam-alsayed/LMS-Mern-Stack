import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function EnrolledCoursesEmpty() {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-dashed border-border bg-card px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>

        <h2 className="text-xl font-semibold text-foreground">
          No enrolled courses
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          You haven&apos;t enrolled in any courses yet. Explore our courses and
          start learning today.
        </p>

        <Link
          href="/courses"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          Explore Courses
        </Link>
      </div>
    </div>
  );
}

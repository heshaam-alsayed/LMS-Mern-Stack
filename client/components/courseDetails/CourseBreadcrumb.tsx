import Link from "next/link";
import { ChevronRight } from "lucide-react";

type CourseBreadcrumbProps = {
  category: string;
  categoryHref?: string;
  courseName: string;
};

export default function CourseBreadcrumb({
  category,
  categoryHref,
  courseName,
}: CourseBreadcrumbProps) {
  return (
    <div className="mb-7 flex flex-wrap items-center gap-2 text-sm">
      {categoryHref ? (
        <Link
          href={categoryHref}
          className="font-semibold text-primary hover:underline">
          {category}
        </Link>
      ) : (
        <span className="font-semibold text-primary">{category}</span>
      )}

      <ChevronRight className="size-4 text-muted-foreground" />

      <span className="font-semibold text-primary">{courseName}</span>
    </div>
  );
}

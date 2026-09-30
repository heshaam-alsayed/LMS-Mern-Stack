import { CoursePrerequisite } from "@/types/course.type";
import { BadgeCheck, BookOpenCheck, Check } from "lucide-react";

type Props = {
  prerequisites?: CoursePrerequisite[];
};

export default function CoursePrerequisites({ prerequisites = [] }: Props) {
  if (!prerequisites.length) return null;

  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        What are the prerequisites for starting this course?
      </h2>

      <div className="mt-5 space-y-4">
        {prerequisites.map((item) => (
          <div key={item._id} className="flex items-start gap-3">
            <BadgeCheck
              className="mt-0.5 size-[18px] shrink-0 text-foreground"
              strokeWidth={2}
            />

            <p className="text-sm leading-6 text-foreground sm:text-[15px]">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

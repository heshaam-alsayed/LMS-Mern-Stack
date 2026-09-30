import { CourseBenefit } from "@/types/course.type";
import { Check, GraduationCap, Sparkles } from "lucide-react";

type Props = {
  benefits?: CourseBenefit[];
};

export default function CourseBenefits({ benefits = [] }: Props) {
  if (!benefits.length) return null;

  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        What you will learn from this course?
      </h2>

      <div className="mt-5 space-y-4">
        {benefits.map((benefit) => (
          <div key={benefit._id} className="flex items-start gap-3">
            <Sparkles
              className="mt-0.5 size-[18px] shrink-0 text-foreground"
              strokeWidth={2}
            />

            <p className="text-sm leading-6 text-foreground sm:text-[15px]">
              {benefit.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

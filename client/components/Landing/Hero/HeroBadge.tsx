import { FaGraduationCap } from "react-icons/fa";

export default function HeroBadge() {
  return (
    <div className="mb-6 flex justify-center lg:justify-start">
      <div
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-border
          bg-card
          px-4
          py-2
          text-xs
          font-medium
          text-muted-foreground
          sm:text-sm
        ">
        <FaGraduationCap className="size-4 text-primary" />

        Trusted by 10,000+ students worldwide
      </div>
    </div>
  );
}